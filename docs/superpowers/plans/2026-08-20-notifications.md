# Notifications (email + in-app) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every booking, message, and dispute event writes an in-app `Notification` row for the affected user and sends them the same copy by email.

**Architecture:** One `NotificationsModule` owning `EmailService` (nodemailer against configurable SMTP, console-log fallback when `EMAIL_HOST` is unset) and `NotificationsService` (`notify` / `findForUser` / `markRead`). `notify()` writes the row then sends the mail in the same call; mail failures are caught and logged so they can never fail the caller's request. The six trigger points are single appended `notificationsService.notify(...)` calls inside the existing bookings/messages/disputes services — no event bus, no queue.

**Tech Stack:** NestJS 11, Prisma 7 (`generated/prisma`, Postgres), `@nestjs/config` 4, nodemailer, Jest 30 + ts-jest.

**Spec:** `docs/superpowers/specs/2026-08-20-notifications-design.md`

## Global Constraints

- `NotificationType` is a Prisma enum with exactly these values: `booking_requested`, `booking_confirmed`, `booking_cancelled`, `message_received`, `dispute_filed`, `dispute_resolved`.
- `NotificationsService.notify(userId, type, title, body, link?)` fires **both** channels in one call — in-app row **and** email, same copy.
- `EmailService.send` failures are **caught and logged, never thrown**: a failed email must not roll back the `Notification` row and must not fail the caller's request.
- When `EMAIL_HOST` is unset, `EmailService.send` logs `[EmailService] would send to ${to}: ${subject}` via Nest's `Logger` and returns — never throws.
- All five `EMAIL_*` env vars are optional; absence of `EMAIL_HOST` triggers the console-log fallback.
- No denormalized unread counter — `GET /notifications` returns the list ordered by `createdAt desc` and callers filter on `read: false`.
- Trigger-point edits are **append-only**: add the `notify(...)` call after the existing write, do not restructure existing logic.
- Tests never touch a real SMTP server or a real database — Prisma and nodemailer are always mocked.
- Both new endpoints require user auth: `@UseGuards(JwtUserAuthGuard)` + `@CurrentUser() user: UserAuthContext` (`user.userId`).
- `PrismaModule` and `ConfigModule` are already `@Global()` / `isGlobal: true` — do **not** re-import them in `NotificationsModule`.

## Plan Rulings (decisions the spec left open)

**Plan Ruling A — nodemailer is mocked with `jest.mock('nodemailer')`, not wrapped or injected.** `EmailService` imports `createTransport` directly from `nodemailer` and calls it inline. Introducing a transport-factory DI token or a wrapper class would be an interface with exactly one implementation, existing purely for the test — and Jest's module mock already gives full control of `createTransport` with zero production code bent around it. `email.service.spec.ts` calls `jest.mock('nodemailer', () => ({ createTransport: jest.fn() }))` at the top of the file; no network is ever reachable from the suite.

**Plan Ruling B — the six new trigger sites get unit tests; the pre-existing behavior of those three services stays untested.** `bookings.service.ts`, `messages.service.ts` and `disputes.service.ts` have no spec files today. This plan adds one spec file per service (Tasks 5–7) containing **only** notification assertions — that `notify` fires, with the right recipient, type and copy. Rationale: the recipient choice is the exact place this feature goes wrong (owner vs renter, sender vs recipient), it is silent when wrong, and it is cheap to pin with the codebase's existing hand-rolled `makePrisma()` pattern. Back-filling coverage for pricing, overlap checks and access control is real work that this feature did not cause and is explicitly deferred; the new spec files are named after their services but are scoped by their `describe` titles to notification behavior only.

**Plan Ruling C — `BookingsService.findById` gains `include: { listing: true }`.** Per the spec, `updateStatus()` needs `listing.title` and must not add a third fetch. The include is added to the shared `findById`, which also widens the `GET /bookings/:id` response with a `listing` object. That is additive (no field removed or renamed) and is the smallest change that satisfies the spec.

**Plan Ruling D — `title` is the spec's copy verbatim; `body` is a one-line detail.** The spec's "Copy" column gives one string per event; it becomes the notification `title` (and the email subject). `body` carries the specific detail already at hand at the call site (request number, message text, dispute detail) so the email has content beyond its subject.

---

## File Structure

**Create:**
- `src/notifications/email.service.ts` — SMTP send + unconfigured fallback. Only file that knows about nodemailer.
- `src/notifications/notifications.service.ts` — `notify` / `findForUser` / `markRead`. Only file that writes `Notification` rows.
- `src/notifications/notifications.controller.ts` — `GET /notifications`, `PATCH /notifications/:id/read`.
- `src/notifications/notifications.module.ts` — wires both services, exports `NotificationsService`.
- `src/notifications/email.service.spec.ts`, `src/notifications/notifications.service.spec.ts`
- `src/bookings/bookings.service.spec.ts`, `src/messages/messages.service.spec.ts`, `src/disputes/disputes.service.spec.ts` — notification-trigger coverage only (Plan Ruling B).

**Modify:**
- `prisma/schema.prisma` — `NotificationType` enum, `Notification` model, `User.notifications` back-relation.
- `.env.example` — five optional `EMAIL_*` vars.
- `package.json` — `nodemailer` + `@types/nodemailer`.
- `src/app.module.ts` — register `NotificationsModule`.
- `src/bookings/bookings.service.ts` (+ `bookings.module.ts`), `src/messages/messages.service.ts` (+ `messages.module.ts`), `src/disputes/disputes.service.ts` (+ `disputes.module.ts`) — trigger points and `NotificationsModule` import.

## Task Map

1. Schema + migration
2. `EmailService` (folds in the nodemailer install and `.env.example`)
3. `NotificationsService`
4. Controller + module + `app.module.ts` registration
5. Bookings triggers (2 of 6)
6. Messages triggers (2 of 6)
7. Disputes triggers (2 of 6)

Tasks 5–7 are split rather than merged because a reviewer can reject the dispute recipient logic ("you notified the filer, not the other party") while approving the messages wiring outright — different services, different recipient rules, independently testable.

---

### Task 1: Prisma schema + migration

**Files:**
- Modify: `prisma/schema.prisma` (add enum after `ReviewDirection` at line 59; add model after `Review`; add back-relation in `User`)

**Interfaces:**
- Consumes: nothing.
- Produces: `NotificationType` enum type at `generated/prisma/enums` with values `booking_requested | booking_confirmed | booking_cancelled | message_received | dispute_filed | dispute_resolved`; `prisma.notification` delegate with `create` / `findMany` / `findUnique` / `update`; `Notification` row shape `{ id: string; type: NotificationType; title: string; body: string; link: string | null; read: boolean; createdAt: Date; userId: string }`.

- [ ] **Step 1: Add the `NotificationType` enum**
In `prisma/schema.prisma`, immediately after the `ReviewDirection` enum block (ends line 59), add:
```prisma
enum NotificationType {
  booking_requested
  booking_confirmed
  booking_cancelled
  message_received
  dispute_filed
  dispute_resolved
}
```

- [ ] **Step 2: Add the `Notification` model**
In `prisma/schema.prisma`, after the `Review` model's closing brace (line 252) and before the `// ── Staff / admin` comment, add:
```prisma
model Notification {
  id        String           @id @default(uuid())
  type      NotificationType
  title     String
  body      String           @db.Text
  link      String? // relative frontend path, e.g. "/bookings/:id"
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())

  userId String
  user   User   @relation(fields: [userId], references: [id])

  @@map("notifications")
}
```

- [ ] **Step 3: Add the `User` back-relation**
In the `User` model, after the `reviewsReceived Review[] @relation("ReviewsReceived")` line, add:
```prisma
  notifications Notification[]
```

- [ ] **Step 4: Validate the schema**
Run: `npx prisma validate`
Expected: `The schema at prisma/schema.prisma is valid 🚀`

- [ ] **Step 5: Create and apply the migration**
Run: `npx prisma migrate dev --name add_notifications`
Expected: a new folder `prisma/migrations/<timestamp>_add_notifications/` containing `migration.sql` with `CREATE TYPE "NotificationType"` and `CREATE TABLE "notifications"`, and the Prisma Client regenerated into `generated/prisma`.

- [ ] **Step 6: Verify the generated enum exists**
Run: `grep -r "booking_requested" generated/prisma/enums.ts`
Expected: a match (the generated `NotificationType` enum).

- [ ] **Step 7: Commit**
```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(db): add Notification model and NotificationType enum"
```

---

### Task 2: EmailService

**Files:**
- Create: `src/notifications/email.service.ts`
- Test: `src/notifications/email.service.spec.ts`
- Modify: `package.json` (adds `nodemailer`, `@types/nodemailer`), `.env.example`

**Interfaces:**
- Consumes: `ConfigService` from `@nestjs/config` (already a global module).
- Produces: `EmailService` with `send(to: string, subject: string, body: string): Promise<void>`.

- [ ] **Step 1: Install nodemailer**
Run: `npm install nodemailer && npm install --save-dev @types/nodemailer`
Expected: `package.json` gains `"nodemailer"` under `dependencies` and `"@types/nodemailer"` under `devDependencies`.

- [ ] **Step 2: Add the EMAIL_* vars to `.env.example`**
Append to `.env.example`:
```bash
# Email delivery (all optional). When EMAIL_HOST is unset, EmailService logs
# the email instead of sending it — that's the dev default, since no mail
# vendor is configured for this project yet.
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM="GearLoop <no-reply@gearloop.example>"
```

- [ ] **Step 3: Write the failing test**
Create `src/notifications/email.service.spec.ts`:
```ts
jest.mock('nodemailer', () => ({ createTransport: jest.fn() }));

import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
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
});
```

- [ ] **Step 4: Run the test to verify it fails**
Run: `npx jest src/notifications/email.service.spec.ts`
Expected: FAIL — `Cannot find module './email.service'`.

- [ ] **Step 5: Write the implementation**
Create `src/notifications/email.service.ts`:
```ts
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
```

- [ ] **Step 6: Run the test to verify it passes**
Run: `npx jest src/notifications/email.service.spec.ts`
Expected: PASS — 4 tests.

- [ ] **Step 7: Commit**
```bash
git add package.json package-lock.json .env.example src/notifications/email.service.ts src/notifications/email.service.spec.ts
git commit -m "feat(notifications): add EmailService with unconfigured-SMTP fallback"
```

---

### Task 3: NotificationsService

**Files:**
- Create: `src/notifications/notifications.service.ts`
- Test: `src/notifications/notifications.service.spec.ts`

**Interfaces:**
- Consumes: `PrismaService` from `../prisma/prisma.service`; `EmailService.send(to, subject, body): Promise<void>` (Task 2); `NotificationType` from `../../generated/prisma/enums` (Task 1).
- Produces: `NotificationsService` with
  - `notify(userId: string, type: NotificationType, title: string, body: string, link?: string): Promise<Notification>`
  - `findForUser(userId: string): Promise<Notification[]>`
  - `markRead(id: string, userId: string): Promise<Notification>`

- [ ] **Step 1: Write the failing test**
Create `src/notifications/notifications.service.spec.ts`:
```ts
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';
import { PrismaService } from '../prisma/prisma.service';

function makePrisma() {
  return {
    user: {
      findUnique: jest.fn(),
    },
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  } as unknown as PrismaService;
}

function makeEmail() {
  return { send: jest.fn().mockResolvedValue(undefined) } as unknown as EmailService;
}

describe('NotificationsService.notify', () => {
  it('creates the notification row and emails the user', async () => {
    const prisma = makePrisma();
    const email = makeEmail();
    (prisma.notification.create as jest.Mock).mockResolvedValue({ id: 'n1' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'u1',
      email: 'renter@example.com',
    });

    const service = new NotificationsService(prisma, email);
    const result = await service.notify(
      'u1',
      'booking_requested',
      'New booking request for Canon R5',
      'Request GL-1 is awaiting your response.',
      '/bookings/b1',
    );

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'u1',
        type: 'booking_requested',
        title: 'New booking request for Canon R5',
        body: 'Request GL-1 is awaiting your response.',
        link: '/bookings/b1',
      },
    });
    expect(email.send).toHaveBeenCalledWith(
      'renter@example.com',
      'New booking request for Canon R5',
      'Request GL-1 is awaiting your response.',
    );
    expect(result).toEqual({ id: 'n1' });
  });

  it('stores link as undefined when no link is given', async () => {
    const prisma = makePrisma();
    (prisma.notification.create as jest.Mock).mockResolvedValue({ id: 'n2' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'u1',
      email: 'renter@example.com',
    });

    const service = new NotificationsService(prisma, makeEmail());
    await service.notify('u1', 'dispute_resolved', 'Title', 'Body');

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'u1',
        type: 'dispute_resolved',
        title: 'Title',
        body: 'Body',
        link: undefined,
      },
    });
  });

  it('still returns the notification when the email send fails', async () => {
    const prisma = makePrisma();
    const email = makeEmail();
    (email.send as jest.Mock).mockRejectedValue(new Error('SMTP down'));
    (prisma.notification.create as jest.Mock).mockResolvedValue({ id: 'n3' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'u1',
      email: 'renter@example.com',
    });

    const service = new NotificationsService(prisma, email);
    await expect(
      service.notify('u1', 'message_received', 'Title', 'Body'),
    ).resolves.toEqual({ id: 'n3' });
  });

  it('still returns the notification when the user lookup finds nobody', async () => {
    const prisma = makePrisma();
    const email = makeEmail();
    (prisma.notification.create as jest.Mock).mockResolvedValue({ id: 'n4' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const service = new NotificationsService(prisma, email);
    await expect(
      service.notify('ghost', 'message_received', 'Title', 'Body'),
    ).resolves.toEqual({ id: 'n4' });
    expect(email.send).not.toHaveBeenCalled();
  });
});

describe('NotificationsService.findForUser', () => {
  it('returns the caller notifications newest first', async () => {
    const prisma = makePrisma();
    (prisma.notification.findMany as jest.Mock).mockResolvedValue([
      { id: 'n1' },
    ]);

    const service = new NotificationsService(prisma, makeEmail());
    const result = await service.findForUser('u1');

    expect(prisma.notification.findMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual([{ id: 'n1' }]);
  });
});

describe('NotificationsService.markRead', () => {
  it('marks the notification read for its owner', async () => {
    const prisma = makePrisma();
    (prisma.notification.findUnique as jest.Mock).mockResolvedValue({
      id: 'n1',
      userId: 'u1',
    });
    (prisma.notification.update as jest.Mock).mockResolvedValue({
      id: 'n1',
      read: true,
    });

    const service = new NotificationsService(prisma, makeEmail());
    const result = await service.markRead('n1', 'u1');

    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: 'n1' },
      data: { read: true },
    });
    expect(result).toEqual({ id: 'n1', read: true });
  });

  it('404s when the notification does not exist', async () => {
    const prisma = makePrisma();
    (prisma.notification.findUnique as jest.Mock).mockResolvedValue(null);

    const service = new NotificationsService(prisma, makeEmail());
    await expect(service.markRead('nope', 'u1')).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.notification.update).not.toHaveBeenCalled();
  });

  it('403s when the notification belongs to someone else', async () => {
    const prisma = makePrisma();
    (prisma.notification.findUnique as jest.Mock).mockResolvedValue({
      id: 'n1',
      userId: 'someone-else',
    });

    const service = new NotificationsService(prisma, makeEmail());
    await expect(service.markRead('n1', 'u1')).rejects.toThrow(
      ForbiddenException,
    );
    expect(prisma.notification.update).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**
Run: `npx jest src/notifications/notifications.service.spec.ts`
Expected: FAIL — `Cannot find module './notifications.service'`.

- [ ] **Step 3: Write the implementation**
Create `src/notifications/notifications.service.ts`:
```ts
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import type { NotificationType } from '../../generated/prisma/enums';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  async notify(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    link?: string,
  ) {
    const notification = await this.prisma.notification.create({
      data: { userId, type, title, body, link },
    });

    // Email is best-effort: the in-app row is the durable channel, so a
    // failed send must never roll it back or fail the caller's request.
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) await this.email.send(user.email, title, body);
    } catch (err) {
      this.logger.error(
        `Failed to email notification ${notification.id} to user ${userId}: ${
          (err as Error).message
        }`,
      );
    }

    return notification;
  }

  findForUser(userId: string) {
    // No denormalized unread counter — callers filter on `read: false`.
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId) {
      throw new ForbiddenException('This notification is not yours');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**
Run: `npx jest src/notifications/notifications.service.spec.ts`
Expected: PASS — 7 tests.

- [ ] **Step 5: Commit**
```bash
git add src/notifications/notifications.service.ts src/notifications/notifications.service.spec.ts
git commit -m "feat(notifications): add NotificationsService with best-effort email"
```

---

### Task 4: Controller, module, app registration

**Files:**
- Create: `src/notifications/notifications.controller.ts`, `src/notifications/notifications.module.ts`
- Modify: `src/app.module.ts`

**Interfaces:**
- Consumes: `NotificationsService.findForUser` / `markRead` (Task 3); `EmailService` (Task 2); `JwtUserAuthGuard`, `CurrentUser`, `UserAuthContext` from `src/auth/`.
- Produces: `NotificationsModule` exporting `NotificationsService` (consumed by Tasks 5–7); routes `GET /notifications` and `PATCH /notifications/:id/read`.

- [ ] **Step 1: Write the controller**
Create `src/notifications/notifications.controller.ts`:
```ts
import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

@UseGuards(JwtUserAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@CurrentUser() user: UserAuthContext) {
    return this.notificationsService.findForUser(user.userId);
  }

  @Patch(':id/read')
  markRead(@CurrentUser() user: UserAuthContext, @Param('id') id: string) {
    return this.notificationsService.markRead(id, user.userId);
  }
}
```

- [ ] **Step 2: Write the module**
Create `src/notifications/notifications.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';

// PrismaModule and ConfigModule are both global — no import needed here.
@Module({
  imports: [AuthModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
```

- [ ] **Step 3: Register the module in `src/app.module.ts`**
Add the import line after the `ReviewsModule` import:
```ts
import { NotificationsModule } from './notifications/notifications.module';
```
and add `NotificationsModule,` to the `imports` array, immediately after `ReviewsModule,`.

- [ ] **Step 4: Verify the app compiles and boots**
Run: `npm run build`
Expected: exit code 0, no TypeScript errors.

- [ ] **Step 5: Verify the routes are registered**
Run: `npm run start:dev`
Expected: startup log lines `Mapped {/notifications, GET} route` and `Mapped {/notifications/:id/read, PATCH} route`. Stop the server with Ctrl-C.

- [ ] **Step 6: Commit**
```bash
git add src/notifications/notifications.controller.ts src/notifications/notifications.module.ts src/app.module.ts
git commit -m "feat(notifications): expose GET /notifications and PATCH /notifications/:id/read"
```

---

### Task 5: Bookings trigger points

**Files:**
- Modify: `src/bookings/bookings.service.ts` (constructor line 16; `findById` lines 86-93; `create` try-block lines 51-68; `updateStatus` lines 111-148)
- Modify: `src/bookings/bookings.module.ts`
- Test: `src/bookings/bookings.service.spec.ts` (create)

**Interfaces:**
- Consumes: `NotificationsService.notify(userId, type, title, body, link?)` and `NotificationsModule` (Tasks 3-4).
- Produces: `booking_requested` notification to `listing.ownerId`; `booking_confirmed` / `booking_cancelled` notifications to `booking.renterId`. `BookingsService` constructor becomes `(prisma: PrismaService, notifications: NotificationsService)`.

- [ ] **Step 1: Write the failing test**
Create `src/bookings/bookings.service.spec.ts`:
```ts
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

function makePrisma() {
  return {
    listing: {
      findUnique: jest.fn(),
    },
    paymentMethod: {
      findUnique: jest.fn(),
    },
    booking: {
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
    },
  } as unknown as PrismaService;
}

function makeNotifications() {
  return {
    notify: jest.fn().mockResolvedValue({ id: 'n1' }),
  } as unknown as NotificationsService;
}

describe('BookingsService.create notifications', () => {
  it('notifies the listing owner of a new booking request', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      id: 'l1',
      title: 'Canon R5',
      ownerId: 'owner-1',
      pricePerDay: 100,
      deletedAt: null,
    });
    (prisma.paymentMethod.findUnique as jest.Mock).mockResolvedValue({
      id: 'pm1',
      userId: 'renter-1',
    });
    (prisma.booking.create as jest.Mock).mockResolvedValue({
      id: 'b1',
      requestNumber: 'GL-1',
    });

    const service = new BookingsService(prisma, notifications);
    await service.create('renter-1', {
      listingId: 'l1',
      paymentMethodId: 'pm1',
      pickupMethod: 'pickup',
      startDate: '2026-09-01',
      endDate: '2026-09-03',
    });

    expect(notifications.notify).toHaveBeenCalledWith(
      'owner-1',
      'booking_requested',
      'New booking request for Canon R5',
      'Request GL-1 is awaiting your response.',
      '/bookings/b1',
    );
  });
});

describe('BookingsService.updateStatus notifications', () => {
  const pendingBooking = {
    id: 'b1',
    requestNumber: 'GL-1',
    listingId: 'l1',
    renterId: 'renter-1',
    startDate: new Date('2026-09-01'),
    endDate: new Date('2026-09-03'),
    listing: { id: 'l1', title: 'Canon R5', ownerId: 'owner-1' },
  };

  it('notifies the renter when the booking is confirmed', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(pendingBooking);
    (prisma.booking.findUniqueOrThrow as jest.Mock).mockResolvedValue(
      pendingBooking,
    );
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'confirmed',
    });

    const service = new BookingsService(prisma, notifications);
    await service.updateStatus('b1', { status: 'confirmed' });

    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'booking_confirmed',
      'Your booking for Canon R5 is confirmed',
      'Booking GL-1 is confirmed.',
      '/bookings/b1',
    );
  });

  it('notifies the renter when the booking is cancelled', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(pendingBooking);
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'cancelled',
    });

    const service = new BookingsService(prisma, notifications);
    await service.updateStatus('b1', { status: 'cancelled' });

    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'booking_cancelled',
      'Your booking for Canon R5 was cancelled',
      'Booking GL-1 was cancelled.',
      '/bookings/b1',
    );
  });

  it('does not notify for a completed booking', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(pendingBooking);
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'completed',
    });

    const service = new BookingsService(prisma, notifications);
    await service.updateStatus('b1', { status: 'completed' });

    expect(notifications.notify).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**
Run: `npx jest src/bookings/bookings.service.spec.ts`
Expected: FAIL — TypeScript error `Expected 1 arguments, but got 2` on `new BookingsService(prisma, notifications)`.

- [ ] **Step 3: Inject `NotificationsService` into `BookingsService`**
In `src/bookings/bookings.service.ts`, add the import after the `calculateBookingPricing` import:
```ts
import { NotificationsService } from '../notifications/notifications.service';
```
and replace the constructor:
```ts
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}
```

- [ ] **Step 4: Add the `booking_requested` trigger**
In `create()`, replace the `return await this.prisma.booking.create({...});` statement inside the `try` block with:
```ts
      const booking = await this.prisma.booking.create({
        data: {
          listingId: dto.listingId,
          renterId,
          paymentMethodId: dto.paymentMethodId,
          pickupMethod: dto.pickupMethod,
          startDate: start,
          endDate: end,
          pricePerDayAtBooking: listing.pricePerDay,
          nights,
          subtotal,
          serviceFee,
          tax,
          total,
        },
        include: { renter: { select: RENTER_SELECT } },
      });

      await this.notifications.notify(
        listing.ownerId,
        'booking_requested',
        `New booking request for ${listing.title}`,
        `Request ${booking.requestNumber} is awaiting your response.`,
        `/bookings/${booking.id}`,
      );

      return booking;
```

- [ ] **Step 5: Add `listing` to `findById`**
In `findById()`, change the `include` so the booking carries its listing (Plan Ruling C):
```ts
      include: { listing: true, renter: { select: RENTER_SELECT } },
```

- [ ] **Step 6: Add the `booking_confirmed` / `booking_cancelled` triggers**
In `updateStatus()`, change the first line from `await this.findById(id);` to:
```ts
    const existing = await this.findById(id);
```
and replace the `return await this.prisma.booking.update({...});` inside the `try` block with:
```ts
      const updated = await this.prisma.booking.update({
        where: { id },
        data: { status: dto.status, ...(payoutStatus !== undefined && { payoutStatus }) },
      });

      if (dto.status === 'confirmed' || dto.status === 'cancelled') {
        await this.notifications.notify(
          existing.renterId,
          dto.status === 'confirmed' ? 'booking_confirmed' : 'booking_cancelled',
          dto.status === 'confirmed'
            ? `Your booking for ${existing.listing.title} is confirmed`
            : `Your booking for ${existing.listing.title} was cancelled`,
          dto.status === 'confirmed'
            ? `Booking ${existing.requestNumber} is confirmed.`
            : `Booking ${existing.requestNumber} was cancelled.`,
          `/bookings/${id}`,
        );
      }

      return updated;
```

- [ ] **Step 7: Import `NotificationsModule` in `BookingsModule`**
In `src/bookings/bookings.module.ts`, add the import and list it:
```ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
```

- [ ] **Step 8: Run the test to verify it passes**
Run: `npx jest src/bookings/bookings.service.spec.ts`
Expected: PASS — 4 tests.

- [ ] **Step 9: Commit**
```bash
git add src/bookings/bookings.service.ts src/bookings/bookings.service.spec.ts src/bookings/bookings.module.ts
git commit -m "feat(bookings): notify on booking requested, confirmed and cancelled"
```

---

### Task 6: Messages trigger points

**Files:**
- Modify: `src/messages/messages.service.ts` (constructor line 13; `createThread` lines 36-44; `sendMessage` lines 47-62)
- Modify: `src/messages/messages.module.ts`
- Test: `src/messages/messages.service.spec.ts` (create)

**Interfaces:**
- Consumes: `NotificationsService.notify(userId, type, title, body, link?)` and `NotificationsModule` (Tasks 3-4).
- Produces: `message_received` notifications to the listing owner (`createThread`) and to whichever side did not send (`sendMessage`). `MessagesService` constructor becomes `(prisma: PrismaService, notifications: NotificationsService)`.

- [ ] **Step 1: Write the failing test**
Create `src/messages/messages.service.spec.ts`:
```ts
import { MessagesService } from './messages.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

function makePrisma() {
  return {
    listing: {
      findUnique: jest.fn(),
    },
    messageThread: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue({ id: 't1' }),
    },
    message: {
      create: jest.fn().mockResolvedValue({ id: 'm1' }),
    },
  } as unknown as PrismaService;
}

function makeNotifications() {
  return {
    notify: jest.fn().mockResolvedValue({ id: 'n1' }),
  } as unknown as NotificationsService;
}

describe('MessagesService.createThread notifications', () => {
  it('notifies the listing owner about the first message', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      id: 'l1',
      title: 'Canon R5',
      ownerId: 'owner-1',
    });
    (prisma.messageThread.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.messageThread.create as jest.Mock).mockResolvedValue({ id: 't1' });

    const service = new MessagesService(prisma, notifications);
    await service.createThread('renter-1', {
      listingId: 'l1',
      text: 'Is this available?',
    });

    expect(notifications.notify).toHaveBeenCalledWith(
      'owner-1',
      'message_received',
      'New message about Canon R5',
      'Is this available?',
      '/messages/t1',
    );
  });
});

describe('MessagesService.sendMessage notifications', () => {
  const thread = {
    id: 't1',
    renterId: 'renter-1',
    listing: { id: 'l1', title: 'Canon R5', ownerId: 'owner-1' },
  };

  it('notifies the owner when the renter sends', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.messageThread.findUnique as jest.Mock).mockResolvedValue(thread);

    const service = new MessagesService(prisma, notifications);
    await service.sendMessage('t1', 'renter-1', { text: 'Still there?' });

    expect(notifications.notify).toHaveBeenCalledWith(
      'owner-1',
      'message_received',
      'New message about Canon R5',
      'Still there?',
      '/messages/t1',
    );
  });

  it('notifies the renter when the owner sends', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.messageThread.findUnique as jest.Mock).mockResolvedValue(thread);

    const service = new MessagesService(prisma, notifications);
    await service.sendMessage('t1', 'owner-1', { text: 'Yes it is.' });

    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'message_received',
      'New message about Canon R5',
      'Yes it is.',
      '/messages/t1',
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**
Run: `npx jest src/messages/messages.service.spec.ts`
Expected: FAIL — TypeScript error `Expected 1 arguments, but got 2` on `new MessagesService(prisma, notifications)`.

- [ ] **Step 3: Inject `NotificationsService` into `MessagesService`**
In `src/messages/messages.service.ts`, add the import after the `SendMessageDto` import:
```ts
import { NotificationsService } from '../notifications/notifications.service';
```
and replace the constructor:
```ts
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}
```

- [ ] **Step 4: Add the `createThread` trigger**
In `createThread()`, insert the notify call between the `message.create` await and the `return this.prisma.messageThread.update(...)`:
```ts
    await this.prisma.message.create({
      data: { threadId: thread.id, senderId: renterId, text: dto.text },
    });

    // The recipient on a first message is always the listing owner —
    // createThread rejects owners messaging their own listing.
    await this.notifications.notify(
      listing.ownerId,
      'message_received',
      `New message about ${listing.title}`,
      dto.text,
      `/messages/${thread.id}`,
    );

    return this.prisma.messageThread.update({
```

- [ ] **Step 5: Add the `sendMessage` trigger**
In `sendMessage()`, insert the notify call between the `message.create` await and the `return this.prisma.messageThread.update(...)`, reusing the already-computed `isRenter`:
```ts
    await this.prisma.message.create({
      data: { threadId, senderId, text: dto.text },
    });

    await this.notifications.notify(
      isRenter ? thread.listing.ownerId : thread.renterId,
      'message_received',
      `New message about ${thread.listing.title}`,
      dto.text,
      `/messages/${threadId}`,
    );

    return this.prisma.messageThread.update({
```

- [ ] **Step 6: Import `NotificationsModule` in `MessagesModule`**
Replace `src/messages/messages.module.ts` with:
```ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
```

- [ ] **Step 7: Run the test to verify it passes**
Run: `npx jest src/messages/messages.service.spec.ts`
Expected: PASS — 3 tests.

- [ ] **Step 8: Commit**
```bash
git add src/messages/messages.service.ts src/messages/messages.service.spec.ts src/messages/messages.module.ts
git commit -m "feat(messages): notify the recipient on new messages"
```

---

### Task 7: Disputes trigger points

**Files:**
- Modify: `src/disputes/disputes.service.ts` (constructor line 13; `create` lines 32-41; `updateStatus` lines 74-86)
- Modify: `src/disputes/disputes.module.ts`
- Test: `src/disputes/disputes.service.spec.ts` (create)

**Interfaces:**
- Consumes: `NotificationsService.notify(userId, type, title, body, link?)` and `NotificationsModule` (Tasks 3-4).
- Produces: `dispute_filed` notification to the booking party who did not file; `dispute_resolved` notifications to both the renter and the listing owner. `DisputesService` constructor becomes `(prisma: PrismaService, notifications: NotificationsService)`.

- [ ] **Step 1: Write the failing test**
Create `src/disputes/disputes.service.spec.ts`:
```ts
import { DisputesService } from './disputes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

function makePrisma() {
  return {
    booking: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    dispute: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((ops: unknown[]) => Promise.all(ops)),
  } as unknown as PrismaService;
}

function makeNotifications() {
  return {
    notify: jest.fn().mockResolvedValue({ id: 'n1' }),
  } as unknown as NotificationsService;
}

const booking = {
  id: 'b1',
  requestNumber: 'GL-1',
  status: 'confirmed',
  renterId: 'renter-1',
  listing: { id: 'l1', title: 'Canon R5', ownerId: 'owner-1' },
};

describe('DisputesService.create notifications', () => {
  it('notifies the owner when the renter files', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(booking);
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.dispute.create as jest.Mock).mockResolvedValue({ id: 'd1' });

    const service = new DisputesService(prisma, notifications);
    await service.create('renter-1', {
      bookingId: 'b1',
      detail: 'Lens was cracked',
    });

    expect(notifications.notify).toHaveBeenCalledWith(
      'owner-1',
      'dispute_filed',
      'A dispute was filed for booking GL-1',
      'Lens was cracked',
      '/disputes/d1',
    );
  });

  it('notifies the renter when the owner files', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(booking);
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.dispute.create as jest.Mock).mockResolvedValue({ id: 'd1' });

    const service = new DisputesService(prisma, notifications);
    await service.create('owner-1', {
      bookingId: 'b1',
      detail: 'Returned late',
    });

    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'dispute_filed',
      'A dispute was filed for booking GL-1',
      'Returned late',
      '/disputes/d1',
    );
  });
});

describe('DisputesService.updateStatus notifications', () => {
  it('notifies both parties when the dispute is resolved', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue({
      id: 'd1',
      bookingId: 'b1',
      booking,
    });
    (prisma.dispute.update as jest.Mock).mockResolvedValue({
      id: 'd1',
      status: 'resolved',
    });

    const service = new DisputesService(prisma, notifications);
    await service.updateStatus('d1', { status: 'resolved' });

    expect(notifications.notify).toHaveBeenCalledTimes(2);
    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'dispute_resolved',
      'The dispute for booking GL-1 was resolved',
      'The dispute for booking GL-1 has been marked resolved.',
      '/disputes/d1',
    );
    expect(notifications.notify).toHaveBeenCalledWith(
      'owner-1',
      'dispute_resolved',
      'The dispute for booking GL-1 was resolved',
      'The dispute for booking GL-1 has been marked resolved.',
      '/disputes/d1',
    );
  });

  it('does not notify when the dispute moves to under_review', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue({
      id: 'd1',
      bookingId: 'b1',
      booking,
    });
    (prisma.dispute.update as jest.Mock).mockResolvedValue({
      id: 'd1',
      status: 'under_review',
    });

    const service = new DisputesService(prisma, notifications);
    await service.updateStatus('d1', { status: 'under_review' });

    expect(notifications.notify).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**
Run: `npx jest src/disputes/disputes.service.spec.ts`
Expected: FAIL — TypeScript error `Expected 1 arguments, but got 2` on `new DisputesService(prisma, notifications)`.

- [ ] **Step 3: Inject `NotificationsService` into `DisputesService`**
In `src/disputes/disputes.service.ts`, add the import after the `UpdateDisputeStatusDto` import:
```ts
import { NotificationsService } from '../notifications/notifications.service';
```
and replace the constructor:
```ts
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}
```

- [ ] **Step 4: Add the `dispute_filed` trigger**
In `create()`, replace `return dispute;` (immediately after the `$transaction`) with:
```ts
    // The other party to the booking — never the filer.
    const recipientId =
      userId === booking.renterId ? booking.listing.ownerId : booking.renterId;
    await this.notifications.notify(
      recipientId,
      'dispute_filed',
      `A dispute was filed for booking ${booking.requestNumber}`,
      dto.detail,
      `/disputes/${dispute.id}`,
    );

    return dispute;
```

- [ ] **Step 5: Add the `dispute_resolved` trigger**
In `updateStatus()`, replace `return this.prisma.dispute.update({ where: { id }, data: { status: dto.status } });` — the final statement of the method — with:
```ts
    const updated = await this.prisma.dispute.update({
      where: { id },
      data: { status: dto.status },
    });

    if (dto.status === 'resolved') {
      await this.notifyResolved(dispute);
    }

    return updated;
```
and, in the `dto.status === 'resolved' && dispute.booking.status !== 'cancelled'` branch, replace `return updated;` with:
```ts
      await this.notifyResolved(dispute);
      return updated;
```
Then add this private method just above `private sanitizeForAdmin<`:
```ts
  // Both parties get told, since either could have filed it.
  private async notifyResolved(dispute: {
    id: string;
    booking: { requestNumber: string; renterId: string; listing: { ownerId: string } };
  }) {
    const title = `The dispute for booking ${dispute.booking.requestNumber} was resolved`;
    const body = `The dispute for booking ${dispute.booking.requestNumber} has been marked resolved.`;
    const link = `/disputes/${dispute.id}`;

    await this.notifications.notify(
      dispute.booking.renterId,
      'dispute_resolved',
      title,
      body,
      link,
    );
    await this.notifications.notify(
      dispute.booking.listing.ownerId,
      'dispute_resolved',
      title,
      body,
      link,
    );
  }
```

- [ ] **Step 6: Import `NotificationsModule` in `DisputesModule`**
Replace `src/disputes/disputes.module.ts` with:
```ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { DisputesController } from './disputes.controller';
import { AdminDisputesController } from './admin-disputes.controller';
import { DisputesService } from './disputes.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [DisputesController, AdminDisputesController],
  providers: [DisputesService],
})
export class DisputesModule {}
```

- [ ] **Step 7: Run the test to verify it passes**
Run: `npx jest src/disputes/disputes.service.spec.ts`
Expected: PASS — 4 tests.

- [ ] **Step 8: Run the whole suite and the build**
Run: `npm test && npm run build && npm run lint`
Expected: all suites pass, build exits 0, lint reports no errors.

- [ ] **Step 9: Commit**
```bash
git add src/disputes/disputes.service.ts src/disputes/disputes.service.spec.ts src/disputes/disputes.module.ts
git commit -m "feat(disputes): notify on dispute filed and resolved"
```

---

## Self-Review

**Spec coverage**

| Spec section | Task |
| --- | --- |
| Ruling 1 (`notify` fires both channels) | Task 3 |
| Ruling 2 (`NotificationType` enum) | Task 1 |
| Ruling 3 (nodemailer + console fallback) | Task 2 |
| Ruling 4 (no unread counter) | Task 3 (`findForUser`) |
| Ruling 5 (append-only triggers, no event bus) | Tasks 5-7 |
| Data model (enum, model, back-relation, migration) | Task 1 |
| `EmailService` | Task 2 |
| `NotificationsService` (`notify` / `findForUser` / `markRead`) | Task 3 |
| API (`GET /notifications`, `PATCH /notifications/:id/read`) | Task 4 |
| Trigger 1-3 (bookings) | Task 5 |
| Trigger 4 (messages, both methods) | Task 6 |
| Trigger 5-6 (disputes) | Task 7 |
| `updateStatus` gets `include: { listing: true }` instead of a third fetch | Task 5 Step 5 (Plan Ruling C) |
| Three modules import `NotificationsModule`; it exports `NotificationsService` | Task 4 Step 2, Tasks 5-7 |
| `app.module.ts` registration | Task 4 Step 3 |
| `.env.example` five vars | Task 2 Step 2 |
| `package.json` nodemailer deps | Task 2 Step 1 |
| Unit tests (mocked Prisma, mocked transport) | Tasks 2, 3, 5, 6, 7 |
| Out-of-scope items (preferences, digests, push, bulk read, retries) | Not implemented anywhere — correct |

**Placeholder scan:** no "TBD", "TODO", "implement later", "similar to Task N", or "add appropriate error handling" appears above. Every step carries the literal code or the literal command to run. The one `ponytail:` comment in `email.service.ts` is deliberate documentation of a known ceiling (no retry/queue), matching the existing convention in `schema.prisma`, not a deferred step.

**Type consistency:**
- `notify(userId: string, type: NotificationType, title: string, body: string, link?: string)` — the signature declared in Task 3 is exactly the shape called in Tasks 5, 6 and 7 (five positional args, link always supplied at trigger sites).
- `EmailService.send(to, subject, body): Promise<void>` — declared in Task 2, called in Task 3 as `this.email.send(user.email, title, body)`.
- The type strings passed at trigger sites (`'booking_requested'`, `'booking_confirmed'`, `'booking_cancelled'`, `'message_received'`, `'dispute_filed'`, `'dispute_resolved'`) are exactly the six `NotificationType` enum members created in Task 1.
- `existing.listing.title` in Task 5 Step 6 is available because Task 5 Step 5 adds `include: { listing: true }` to `findById`; `thread.listing.title` in Task 6 is available because `findThreadWithAccess` already includes the listing; `dispute.booking.listing.ownerId` in Task 7 is available because `DisputesService.findById` already includes `booking: { include: { listing: true } }`.
- `booking.requestNumber` (Tasks 5, 7) exists on the `Booking` model (`@unique @default(cuid())`).
- `PrismaModule` is `@Global()` and `ConfigModule` is registered with `isGlobal: true`, so `NotificationsModule` importing only `AuthModule` is correct.
