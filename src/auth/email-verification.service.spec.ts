import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../notifications/email.service';
import {
  EmailVerificationService,
  MAX_ATTEMPTS,
  RESEND_COOLDOWN_SECONDS,
} from './email-verification.service';

jest.mock('bcrypt', () => {
  const actual = jest.requireActual<typeof import('bcrypt')>('bcrypt');
  const compare = jest.fn();
  compare.mockImplementation((...args: Parameters<typeof actual.compare>) =>
    actual.compare(...args),
  );
  return { ...actual, compare };
});

const compareMock = bcrypt.compare as unknown as jest.Mock;

function makePrisma() {
  return {
    user: { findUnique: jest.fn(), update: jest.fn() },
    emailVerificationCode: {
      upsert: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    $transaction: jest.fn(),
  } as unknown as PrismaService;
}

function makeEmail() {
  return {
    send: jest.fn().mockResolvedValue(undefined),
  } as unknown as EmailService;
}

function makeConfig() {
  return {
    get: jest.fn((_key: string, fallback?: unknown) => fallback),
  } as unknown as ConfigService;
}

function makeService(prisma: PrismaService, email: EmailService = makeEmail()) {
  return new EmailVerificationService(prisma, email, makeConfig());
}

const minutesFromNow = (minutes: number) =>
  new Date(Date.now() + minutes * 60_000);

async function unverifiedUser(codeOverrides: object = {}) {
  return {
    id: 'u1',
    email: 'renter@example.com',
    emailVerifiedAt: null,
    deletedAt: null,
    isSuspended: false,
    emailVerificationCode: {
      userId: 'u1',
      codeHash: await bcrypt.hash('123456', 4),
      expiresAt: minutesFromNow(5),
      attempts: 0,
      sentAt: new Date(),
      ...codeOverrides,
    },
  };
}

describe('EmailVerificationService.sendCode', () => {
  it('stores_a_hashed_six_digit_code_and_emails_the_plain_code', async () => {
    const prisma = makePrisma();
    const email = makeEmail();

    await makeService(prisma, email).sendCode({
      id: 'u1',
      email: 'renter@example.com',
    });

    const [to, subject, body] = (email.send as jest.Mock).mock.calls[0] as [
      string,
      string,
      string,
    ];
    const code = /\b(\d{6})\b/.exec(body)![1];
    const [stored] = (prisma.emailVerificationCode.upsert as jest.Mock).mock
      .calls[0] as [
      { create: { codeHash: string }; update: { attempts: number } },
    ];
    expect(to).toBe('renter@example.com');
    expect(subject).toBe('Your GearLoop verification code');
    expect(body).toContain('10 minutes');
    expect(stored.create.codeHash).not.toBe(code);
    expect(await bcrypt.compare(code, stored.create.codeHash)).toBe(true);
    expect(stored.update.attempts).toBe(0);
  });

  it('does_not_throw_when_the_email_send_fails', async () => {
    const email = makeEmail();
    (email.send as jest.Mock).mockRejectedValue(new Error('smtp down'));

    await expect(
      makeService(makePrisma(), email).sendCode({ id: 'u1', email: 'a@b.co' }),
    ).resolves.toBeUndefined();
  });
});

describe('EmailVerificationService.verify', () => {
  it('marks_the_user_verified_and_deletes_the_code_in_one_transaction', async () => {
    const prisma = makePrisma();
    const verifiedUser = { id: 'u1', emailVerifiedAt: new Date() };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(
      await unverifiedUser(),
    );
    (prisma.$transaction as jest.Mock).mockResolvedValue([verifiedUser, {}]);

    const result = await makeService(prisma).verify({
      email: 'renter@example.com',
      code: '123456',
    });

    expect(result).toBe(verifiedUser);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.emailVerificationCode.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
    });
  });

  it('increments_attempts_on_a_wrong_code', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(
      await unverifiedUser(),
    );

    await expect(
      makeService(prisma).verify({
        email: 'renter@example.com',
        code: '000000',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.emailVerificationCode.updateMany).toHaveBeenCalledTimes(1);
  });

  it('counts_the_attempt_before_comparing_the_code', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(
      await unverifiedUser(),
    );
    compareMock.mockClear();

    await expect(
      makeService(prisma).verify({
        email: 'renter@example.com',
        code: '000000',
      }),
    ).rejects.toThrow(BadRequestException);

    const [claimArgs] = (prisma.emailVerificationCode.updateMany as jest.Mock)
      .mock.calls[0] as [
      {
        where: {
          userId: string;
          attempts: { lt: number };
          expiresAt: { gt: Date };
        };
        data: { attempts: { increment: number } };
      },
    ];
    expect(claimArgs.where.userId).toBe('u1');
    expect(claimArgs.where.attempts).toEqual({ lt: MAX_ATTEMPTS });
    expect(claimArgs.data).toEqual({ attempts: { increment: 1 } });
    const claimOrder = (prisma.emailVerificationCode.updateMany as jest.Mock)
      .mock.invocationCallOrder[0];
    expect(claimOrder).toBeLessThan(compareMock.mock.invocationCallOrder[0]);
  });

  it('rejects_without_comparing_when_no_attempt_can_be_claimed', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(
      await unverifiedUser(),
    );
    (prisma.emailVerificationCode.updateMany as jest.Mock).mockResolvedValue({
      count: 0,
    });
    compareMock.mockClear();

    await expect(
      makeService(prisma).verify({
        email: 'renter@example.com',
        code: '123456',
      }),
    ).rejects.toThrow('Invalid or expired code');

    expect(compareMock).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('rejects_an_expired_code', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(
      await unverifiedUser({ expiresAt: minutesFromNow(-1) }),
    );

    await expect(
      makeService(prisma).verify({
        email: 'renter@example.com',
        code: '123456',
      }),
    ).rejects.toThrow(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('rejects_even_the_correct_code_once_attempts_are_exhausted', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(
      await unverifiedUser({ attempts: MAX_ATTEMPTS }),
    );

    await expect(
      makeService(prisma).verify({
        email: 'renter@example.com',
        code: '123456',
      }),
    ).rejects.toThrow(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('rejects_with_the_generic_message_for_an_unknown_email', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      makeService(prisma).verify({
        email: 'nobody@example.com',
        code: '123456',
      }),
    ).rejects.toThrow('Invalid or expired code');
  });

  it('rejects_an_already_verified_user', async () => {
    const prisma = makePrisma();
    const user = await unverifiedUser();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...user,
      emailVerifiedAt: new Date(),
    });

    await expect(
      makeService(prisma).verify({
        email: 'renter@example.com',
        code: '123456',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});

describe('EmailVerificationService.resend', () => {
  it('sends_a_new_code_when_the_last_one_is_older_than_the_cooldown', async () => {
    const prisma = makePrisma();
    const email = makeEmail();
    const sentAt = new Date(Date.now() - (RESEND_COOLDOWN_SECONDS + 1) * 1000);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(
      await unverifiedUser({ sentAt }),
    );

    await makeService(prisma, email).resend('renter@example.com');

    expect(email.send).toHaveBeenCalledTimes(1);
  });

  it('does_not_send_within_the_cooldown', async () => {
    const prisma = makePrisma();
    const email = makeEmail();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(
      await unverifiedUser({ sentAt: new Date() }),
    );

    await makeService(prisma, email).resend('renter@example.com');

    expect(email.send).not.toHaveBeenCalled();
  });

  it('does_not_send_for_an_unknown_email', async () => {
    const prisma = makePrisma();
    const email = makeEmail();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      makeService(prisma, email).resend('nobody@example.com'),
    ).resolves.toBeUndefined();
    expect(email.send).not.toHaveBeenCalled();
  });

  it.each([
    ['verified', { emailVerifiedAt: new Date() }],
    ['deleted', { deletedAt: new Date() }],
    ['suspended', { isSuspended: true }],
  ])('does_not_send_for_a_%s_user', async (_label, overrides) => {
    const prisma = makePrisma();
    const email = makeEmail();
    const user = await unverifiedUser({ sentAt: new Date(0) });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...user,
      ...overrides,
    });

    await makeService(prisma, email).resend('renter@example.com');

    expect(email.send).not.toHaveBeenCalled();
  });
});
