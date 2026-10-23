// Fills the LOCAL dev database with realistic users, listings, bookings,
// reviews, messages and notifications. Safe to re-run: it first removes
// only the accounts it created (see SEED_EMAIL_DOMAIN) and their data.
//
//   npm run seed:dev
//
// It compiles into .seed-build/, not dist/ — rebuilding dist/ kills a
// running `nest start --watch`.
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  DepositStatus,
  Prisma,
  PrismaClient,
} from '../../generated/prisma/client';
import { calculateBookingPricing } from '../bookings/booking-pricing.util';
import { calculateRefund } from '../bookings/booking-cancellation.util';
import {
  deliveryFeeForDistance,
  haversineKm,
} from '../bookings/delivery-pricing.util';
import { chargeCurrency } from '../common/country-currency';
import { assertLocalDatabaseUrl } from './local-database-guard';
import {
  blackouts,
  bookings,
  DEMO_USER_KEY,
  listings,
  notifications,
  SEED_EMAIL_DOMAIN,
  SEED_PASSWORD,
  type SeedBooking,
  type SeedListing,
  type SeedUser,
  threads,
  unsplashUrl,
  users,
} from './seed-dev-data';

type Tx = Prisma.TransactionClient;
type IdsByKey = Map<string, string>;

interface SeededIds {
  users: IdsByKey;
  listings: IdsByKey;
  bookings: IdsByKey;
  threads: IdsByKey;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_MINUTE = 60 * 1000;

const now = new Date();
const todayUtc = new Date(
  Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
);

function daysFromToday(days: number): Date {
  return new Date(todayUtc.getTime() + days * MS_PER_DAY);
}

function minutesAgo(minutes: number): Date {
  return new Date(now.getTime() - minutes * MS_PER_MINUTE);
}

function emailFor(userKey: string): string {
  return `${userKey}@${SEED_EMAIL_DOMAIN}`;
}

function initialsOf(name: string): string {
  const words = name.split(' ');
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function findByKey<T extends { key: string }>(rows: T[], key: string): T {
  const row = rows.find((candidate) => candidate.key === key);
  if (!row) throw new Error(`Seed data references unknown key "${key}"`);
  return row;
}

function idFor(ids: IdsByKey, key: string): string {
  const id = ids.get(key);
  if (!id) throw new Error(`No seeded row for key "${key}"`);
  return id;
}

async function deleteSeededData(tx: Tx): Promise<void> {
  const seededUsers = await tx.user.findMany({
    where: { email: { endsWith: `@${SEED_EMAIL_DOMAIN}` } },
    select: { id: true },
  });
  const userIds = seededUsers.map((user) => user.id);
  const seededListings = await tx.listing.findMany({
    where: { ownerId: { in: userIds } },
    select: { id: true },
  });
  const listingIds = seededListings.map((listing) => listing.id);

  const touchesSeed = {
    OR: [{ renterId: { in: userIds } }, { listingId: { in: listingIds } }],
  };

  await tx.notification.deleteMany({ where: { userId: { in: userIds } } });
  await tx.review.deleteMany({
    where: {
      OR: [
        { booking: touchesSeed },
        { authorId: { in: userIds } },
        { revieweeId: { in: userIds } },
      ],
    },
  });
  await tx.handoffPhoto.deleteMany({
    where: { OR: [{ booking: touchesSeed }, { uploaderId: { in: userIds } }] },
  });
  await tx.dispute.deleteMany({ where: { booking: touchesSeed } });
  await tx.message.deleteMany({
    where: { OR: [{ thread: touchesSeed }, { senderId: { in: userIds } }] },
  });
  await tx.messageThread.deleteMany({ where: touchesSeed });
  await tx.booking.deleteMany({ where: touchesSeed });
  await tx.blackout.deleteMany({ where: { listingId: { in: listingIds } } });
  await tx.listing.deleteMany({ where: { id: { in: listingIds } } });
  await tx.user.deleteMany({ where: { id: { in: userIds } } });
}

async function createUsers(tx: Tx): Promise<IdsByKey> {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  const ids: IdsByKey = new Map();

  for (const user of users) {
    const created = await tx.user.create({
      data: {
        name: user.name,
        email: emailFor(user.key),
        passwordHash,
        initials: initialsOf(user.name),
        isOwner: listings.some((listing) => listing.ownerKey === user.key),
        memberSince: new Date(user.memberSince),
        responseTime: user.responseTime,
        emailVerifiedAt: new Date(user.memberSince),
        address: user.address,
        lat: user.lat,
        lng: user.lng,
      },
    });
    ids.set(user.key, created.id);
  }
  return ids;
}

async function createListings(tx: Tx, userIds: IdsByKey): Promise<IdsByKey> {
  const ids: IdsByKey = new Map();

  for (const listing of listings) {
    const created = await tx.listing.create({
      data: {
        title: listing.title,
        category: listing.category,
        country: listing.country,
        pricePerDay: listing.pricePerDay,
        depositAmount: listing.depositAmount,
        cancellationPolicy: listing.cancellationPolicy,
        description: listing.description,
        images: listing.photoIds.map(unsplashUrl),
        status: listing.status ?? 'active',
        createdAt: daysFromToday(-listing.daysSinceListed),
        ownerId: idFor(userIds, listing.ownerKey),
      },
    });
    ids.set(listing.key, created.id);
  }
  return ids;
}

// Mirrors the transitions in BookingsService: a hold is placed on
// confirmation, released on a clean return or a cancellation, and kept
// while a dispute is open.
function depositStatusFor(
  booking: SeedBooking,
  depositAmount: number,
): DepositStatus | null {
  if (depositAmount === 0 || booking.status === 'pending') return null;
  if (booking.status === 'confirmed') return 'held';
  if (booking.dispute && booking.dispute.status !== 'resolved') return 'held';
  return 'released';
}

function deliveryFeeFor(booking: SeedBooking, listing: SeedListing): number {
  if (booking.pickupMethod !== 'delivery') return 0;
  const owner: SeedUser = findByKey(users, listing.ownerKey);
  const renter: SeedUser = findByKey(users, booking.renterKey);
  return deliveryFeeForDistance(haversineKm(owner, renter));
}

function cancellationFields(booking: SeedBooking, listing: SeedListing) {
  if (!booking.cancellation) return {};

  const cancelledAt = daysFromToday(-booking.cancellation.daysAgo);
  const pricing = calculateBookingPricing(listing.pricePerDay, booking.nights);
  return {
    cancelledAt,
    cancelledBy: booking.cancellation.by,
    cancellationReason: booking.cancellation.reason,
    refundAmount: calculateRefund({
      policy: listing.cancellationPolicy,
      total: pricing.total.plus(deliveryFeeFor(booking, listing)),
      startDate: daysFromToday(booking.startInDays),
      status: 'confirmed',
      cancelledBy: booking.cancellation.by,
      now: cancelledAt,
    }),
  };
}

function requestedAt(booking: SeedBooking): Date {
  const daysBeforeStart = booking.startInDays - 5;
  return daysBeforeStart < 0
    ? daysFromToday(daysBeforeStart)
    : minutesAgo(26 * 60);
}

async function createBooking(
  tx: Tx,
  booking: SeedBooking,
  ids: Pick<SeededIds, 'users' | 'listings'>,
): Promise<string> {
  const listing = findByKey(listings, booking.listingKey);
  const pricing = calculateBookingPricing(listing.pricePerDay, booking.nights);
  const deliveryFee = new Prisma.Decimal(
    deliveryFeeFor(booking, listing).toFixed(2),
  );

  const created = await tx.booking.create({
    data: {
      status: booking.status,
      startDate: daysFromToday(booking.startInDays),
      endDate: daysFromToday(booking.startInDays + booking.nights),
      pickupMethod: booking.pickupMethod,
      createdAt: requestedAt(booking),
      currency: chargeCurrency(listing.country),
      depositStatus: depositStatusFor(booking, listing.depositAmount),
      depositAmount: listing.depositAmount,
      pricePerDayAtBooking: listing.pricePerDay,
      nights: booking.nights,
      ...pricing,
      deliveryFee,
      total: pricing.total.plus(deliveryFee),
      ...cancellationFields(booking, listing),
      listingId: idFor(ids.listings, listing.key),
      renterId: idFor(ids.users, booking.renterKey),
    },
  });
  return created.id;
}

async function createReviews(
  tx: Tx,
  booking: SeedBooking,
  ids: Pick<SeededIds, 'users' | 'bookings'>,
): Promise<void> {
  const listing = findByKey(listings, booking.listingKey);
  const renterId = idFor(ids.users, booking.renterKey);
  const ownerId = idFor(ids.users, listing.ownerKey);
  const bookingId = idFor(ids.bookings, booking.key);
  const reviewedAt = daysFromToday(booking.startInDays + booking.nights + 1);

  if (booking.renterReview) {
    await tx.review.create({
      data: {
        ...booking.renterReview,
        direction: 'renter_to_owner',
        createdAt: reviewedAt,
        bookingId,
        authorId: renterId,
        revieweeId: ownerId,
      },
    });
  }
  if (booking.ownerReview) {
    await tx.review.create({
      data: {
        ...booking.ownerReview,
        direction: 'owner_to_renter',
        createdAt: reviewedAt,
        bookingId,
        authorId: ownerId,
        revieweeId: renterId,
      },
    });
  }
}

async function createHandoffPhotos(
  tx: Tx,
  booking: SeedBooking,
  ids: Pick<SeededIds, 'users' | 'bookings'>,
): Promise<void> {
  if (!booking.handoff) return;

  const listing = findByKey(listings, booking.listingKey);
  const bookingId = idFor(ids.bookings, booking.key);
  const ownerId = idFor(ids.users, listing.ownerKey);
  const renterId = idFor(ids.users, booking.renterKey);
  const [pickupPhoto, returnPhoto = pickupPhoto] = listing.photoIds;

  await tx.handoffPhoto.create({
    data: {
      stage: 'pickup',
      url: unsplashUrl(pickupPhoto),
      note: booking.handoff.pickupNote,
      createdAt: daysFromToday(booking.startInDays),
      bookingId,
      uploaderId: renterId,
    },
  });
  if (booking.handoff.returnNote) {
    await tx.handoffPhoto.create({
      data: {
        stage: 'returned',
        url: unsplashUrl(returnPhoto),
        note: booking.handoff.returnNote,
        createdAt: daysFromToday(booking.startInDays + booking.nights),
        bookingId,
        uploaderId: ownerId,
      },
    });
  }
}

async function createBookingsWithActivity(
  tx: Tx,
  ids: Pick<SeededIds, 'users' | 'listings'>,
): Promise<IdsByKey> {
  const bookingIds: IdsByKey = new Map();

  for (const booking of bookings) {
    bookingIds.set(booking.key, await createBooking(tx, booking, ids));
    const activityIds = { users: ids.users, bookings: bookingIds };
    await createReviews(tx, booking, activityIds);
    await createHandoffPhotos(tx, booking, activityIds);
    if (booking.dispute) {
      await tx.dispute.create({
        data: { ...booking.dispute, bookingId: idFor(bookingIds, booking.key) },
      });
    }
  }
  return bookingIds;
}

async function createThreads(
  tx: Tx,
  ids: Pick<SeededIds, 'users' | 'listings'>,
): Promise<IdsByKey> {
  const threadIds: IdsByKey = new Map();

  for (const thread of threads) {
    const listing = findByKey(listings, thread.listingKey);
    const renterId = idFor(ids.users, thread.renterKey);
    const ownerId = idFor(ids.users, listing.ownerKey);
    const firstMessageMinutesAgo = Math.max(
      ...thread.messages.map((message) => message.minutesAgo),
    );

    const created = await tx.messageThread.create({
      data: {
        unreadForRenter: thread.unreadForRenter,
        unreadForOwner: thread.unreadForOwner,
        createdAt: minutesAgo(firstMessageMinutesAgo),
        listingId: idFor(ids.listings, listing.key),
        renterId,
        messages: {
          create: thread.messages.map((message) => ({
            text: message.text,
            sentAt: minutesAgo(message.minutesAgo),
            senderId: message.from === 'renter' ? renterId : ownerId,
          })),
        },
      },
    });
    threadIds.set(thread.key, created.id);
  }
  return threadIds;
}

async function createBlackouts(tx: Tx, listingIds: IdsByKey): Promise<void> {
  await tx.blackout.createMany({
    data: blackouts.map((blackout) => ({
      startDate: daysFromToday(blackout.startInDays),
      endDate: daysFromToday(blackout.startInDays + blackout.nights),
      reason: blackout.reason,
      listingId: idFor(listingIds, blackout.listingKey),
    })),
  });
}

async function createNotifications(tx: Tx, ids: SeededIds): Promise<void> {
  await tx.notification.createMany({
    data: notifications.map((notification) => ({
      type: notification.type,
      title: notification.title,
      body: notification.body,
      link:
        'bookingKey' in notification.link
          ? `/bookings/${idFor(ids.bookings, notification.link.bookingKey)}`
          : `/messages/${idFor(ids.threads, notification.link.threadKey)}`,
      read: notification.read,
      createdAt: minutesAgo(notification.hoursAgo * 60),
      userId: idFor(ids.users, notification.userKey),
    })),
  });
}

async function seed(tx: Tx): Promise<void> {
  await deleteSeededData(tx);
  const userIds = await createUsers(tx);
  const listingIds = await createListings(tx, userIds);
  const baseIds = { users: userIds, listings: listingIds };
  const bookingIds = await createBookingsWithActivity(tx, baseIds);
  const threadIds = await createThreads(tx, baseIds);
  await createBlackouts(tx, listingIds);
  await createNotifications(tx, {
    ...baseIds,
    bookings: bookingIds,
    threads: threadIds,
  });
}

function printSummary(): void {
  console.log(
    `Seeded ${users.length} users, ${listings.length} listings, ${bookings.length} bookings, ${threads.length} message threads.`,
  );
  console.log(
    `Demo login (renter + owner): ${emailFor(DEMO_USER_KEY)} / ${SEED_PASSWORD}`,
  );
  console.log(
    `Every other seeded account uses <name>@${SEED_EMAIL_DOMAIN} with the same password.`,
  );
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  assertLocalDatabaseUrl(databaseUrl);

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
  try {
    await prisma.$transaction(seed, { timeout: 60_000 });
    printSummary();
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
