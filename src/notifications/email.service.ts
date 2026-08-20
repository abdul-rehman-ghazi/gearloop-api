import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

// ponytail: direct SMTP send, no retry and no queue. A failed send is
// swallowed by NotificationsService and lost. Add a queue (BullMQ) or a
// vendor SDK with built-in retries once email volume justifies it.
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {}

  async send(to: string, subject: string, body: string): Promise<void> {
    const host = this.config.get<string>('EMAIL_HOST');

    // No mail vendor configured (the dev default) — log and return rather
    // than throwing, so notification writes never depend on SMTP existing.
    if (!host) {
      this.logger.log(`[EmailService] would send to ${to}: ${subject}`);
      return;
    }

    const user = this.config.get<string>('EMAIL_USER');
    const pass = this.config.get<string>('EMAIL_PASS');

    const transport = createTransport({
      host,
      port: Number(this.config.get<string>('EMAIL_PORT') ?? 587),
      ...(user && pass ? { auth: { user, pass } } : {}),
    });

    await transport.sendMail({
      from: this.config.get<string>('EMAIL_FROM'),
      to,
      subject,
      text: body,
    });
  }
}
