jest.mock('nodemailer', () => ({ createTransport: jest.fn() }));

import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { EmailService } from './email.service';

function makeConfig(values: Record<string, string | undefined>) {
  return {
    get: jest.fn((key: string) => values[key]),
  } as unknown as ConfigService;
}

describe('EmailService.send', () => {
  beforeEach(() => {
    (createTransport as jest.Mock).mockReset();
  });

  it('logs instead of sending when EMAIL_HOST is unset', async () => {
    const service = new EmailService(makeConfig({}));

    await expect(
      service.send('renter@example.com', 'Subject', 'Body'),
    ).resolves.toBeUndefined();
    expect(createTransport).not.toHaveBeenCalled();
  });

  it('sends via SMTP when EMAIL_HOST is set', async () => {
    const sendMail = jest.fn().mockResolvedValue(undefined);
    (createTransport as jest.Mock).mockReturnValue({ sendMail });

    const service = new EmailService(
      makeConfig({
        EMAIL_HOST: 'smtp.example.com',
        EMAIL_PORT: '2525',
        EMAIL_USER: 'user',
        EMAIL_PASS: 'pass',
        EMAIL_FROM: 'GearLoop <no-reply@gearloop.example>',
      }),
    );
    await service.send('renter@example.com', 'Subject', 'Body');

    expect(createTransport).toHaveBeenCalledWith({
      host: 'smtp.example.com',
      port: 2525,
      auth: { user: 'user', pass: 'pass' },
    });
    expect(sendMail).toHaveBeenCalledWith({
      from: 'GearLoop <no-reply@gearloop.example>',
      to: 'renter@example.com',
      subject: 'Subject',
      text: 'Body',
    });
  });

  it('defaults the port to 587 and omits auth when no credentials are set', async () => {
    const sendMail = jest.fn().mockResolvedValue(undefined);
    (createTransport as jest.Mock).mockReturnValue({ sendMail });

    const service = new EmailService(
      makeConfig({ EMAIL_HOST: 'smtp.example.com' }),
    );
    await service.send('owner@example.com', 'Hi', 'There');

    expect(createTransport).toHaveBeenCalledWith({
      host: 'smtp.example.com',
      port: 587,
    });
    expect(sendMail).toHaveBeenCalledWith({
      from: undefined,
      to: 'owner@example.com',
      subject: 'Hi',
      text: 'There',
    });
  });

  it('propagates transport errors to the caller', async () => {
    (createTransport as jest.Mock).mockReturnValue({
      sendMail: jest.fn().mockRejectedValue(new Error('SMTP down')),
    });

    const service = new EmailService(
      makeConfig({ EMAIL_HOST: 'smtp.example.com' }),
    );
    await expect(service.send('a@b.c', 'S', 'B')).rejects.toThrow('SMTP down');
  });

  describe('dev log when EMAIL_HOST is unset', () => {
    const originalEnv = process.env.NODE_ENV;
    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      jest.restoreAllMocks();
    });

    it('includes_the_body_outside_production', async () => {
      process.env.NODE_ENV = 'development';
      const log = jest.spyOn(Logger.prototype, 'log').mockImplementation();

      await new EmailService(makeConfig({})).send(
        'a@b.co',
        'Subject',
        'code 123456',
      );

      expect(log).toHaveBeenCalledWith(expect.stringContaining('code 123456'));
    });

    it('omits_the_body_in_production', async () => {
      process.env.NODE_ENV = 'production';
      const log = jest.spyOn(Logger.prototype, 'log').mockImplementation();

      await new EmailService(makeConfig({})).send(
        'a@b.co',
        'Subject',
        'code 123456',
      );

      expect(log).toHaveBeenCalledWith(expect.not.stringContaining('123456'));
    });
  });
});
