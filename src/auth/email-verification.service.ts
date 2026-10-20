import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../notifications/email.service';

export const CODE_TTL_MINUTES = 10;
export const MAX_ATTEMPTS = 5;
export const RESEND_COOLDOWN_SECONDS = 60;

const INVALID_CODE_MESSAGE = 'Invalid or expired code';

interface CodeRecipient {
  id: string;
  email: string;
}

interface VerifyInput {
  email: string;
  code: string;
}

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) {}

  // A send failure is logged, not thrown: the user row already exists and
  // they can recover with resend-verification.
  async sendCode(recipient: CodeRecipient): Promise<void> {
    const code = this.generateCode();
    const codeHash = await bcrypt.hash(code, this.saltRounds());
    const fields = {
      codeHash,
      expiresAt: new Date(Date.now() + CODE_TTL_MINUTES * 60_000),
      attempts: 0,
      sentAt: new Date(),
    };
    await this.prisma.emailVerificationCode.upsert({
      where: { userId: recipient.id },
      create: { userId: recipient.id, ...fields },
      update: fields,
    });

    try {
      await this.emailService.send(
        recipient.email,
        'Your GearLoop verification code',
        `Your GearLoop verification code is ${code}. It expires in ${CODE_TTL_MINUTES} minutes.`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${recipient.email}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  async verify(input: VerifyInput) {
    const user = await this.findUserWithCode(input.email);
    const stored = user?.emailVerificationCode;
    if (!user || !stored || user.emailVerifiedAt || user.deletedAt) {
      throw new BadRequestException(INVALID_CODE_MESSAGE);
    }
    if (user.isSuspended) throw new BadRequestException(INVALID_CODE_MESSAGE);
    if (stored.expiresAt < new Date() || stored.attempts >= MAX_ATTEMPTS) {
      throw new BadRequestException(INVALID_CODE_MESSAGE);
    }
    if (!(await this.claimAttempt(user.id))) {
      throw new BadRequestException(INVALID_CODE_MESSAGE);
    }

    const codeMatches = await bcrypt.compare(input.code, stored.codeHash);
    if (!codeMatches) throw new BadRequestException(INVALID_CODE_MESSAGE);

    const [verifiedUser] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      }),
      this.prisma.emailVerificationCode.deleteMany({
        where: { userId: user.id },
      }),
    ]);
    return verifiedUser;
  }

  // Silent no-op for every ineligible case so callers can't enumerate accounts.
  async resend(email: string): Promise<void> {
    const user = await this.findUserWithCode(email);
    if (!user || user.emailVerifiedAt || user.deletedAt || user.isSuspended) {
      return;
    }
    if (this.isWithinCooldown(user.emailVerificationCode?.sentAt)) return;

    await this.sendCode(user);
  }

  // The attempt is counted before the slow bcrypt compare: counting after let
  // parallel requests all read attempts < MAX and each get a guess in.
  private async claimAttempt(userId: string): Promise<boolean> {
    const claim = await this.prisma.emailVerificationCode.updateMany({
      where: {
        userId,
        attempts: { lt: MAX_ATTEMPTS },
        expiresAt: { gt: new Date() },
      },
      data: { attempts: { increment: 1 } },
    });
    return claim.count > 0;
  }

  private findUserWithCode(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { emailVerificationCode: true },
    });
  }

  private isWithinCooldown(lastSentAt: Date | undefined): boolean {
    if (!lastSentAt) return false;
    return Date.now() - lastSentAt.getTime() < RESEND_COOLDOWN_SECONDS * 1000;
  }

  private generateCode(): string {
    return randomInt(0, 1_000_000).toString().padStart(6, '0');
  }

  private saltRounds(): number {
    return Number(this.config.get('BCRYPT_SALT_ROUNDS', 10));
  }
}
