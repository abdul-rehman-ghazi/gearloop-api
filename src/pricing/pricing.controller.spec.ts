import { PricingController } from './pricing.controller';
import { PrismaService } from '../prisma/prisma.service';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

function makePrisma() {
  return {
    listing: { findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
  } as unknown as PrismaService;
}

const renter: UserAuthContext = {
  userId: 'renter-1',
  email: 'renter@example.com',
  isOwner: false,
};

describe('PricingController', () => {
  it('matches the API pricing formula for a $200 subtotal', async () => {
    const controller = new PricingController(makePrisma());

    const quote = await controller.quote({ pricePerDay: 100, nights: 2 });

    expect(quote.subtotal).toBe('200.00');
    expect(quote.serviceFee).toBe('20.00');
    expect(quote.tax).toBe('17.60');
    expect(quote.deliveryFee).toBe('0.00');
    expect(quote.total).toBe('237.60');
  });

  it('adds a distance-based delivery fee when both parties have addresses', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      owner: { lat: -33.9249, lng: 18.4241 }, // Cape Town
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      lat: -26.2041,
      lng: 28.0473, // Johannesburg — well past the distance cap
    });
    const controller = new PricingController(prisma);

    const quote = await controller.quote(
      {
        pricePerDay: 100,
        nights: 2,
        pickupMethod: 'delivery',
        listingId: 'l1',
      },
      renter,
    );

    expect(quote.deliveryFee).toBe('50.00');
    expect(quote.total).toBe('287.60');
  });

  it('rejects delivery pricing when the caller is not signed in', async () => {
    const controller = new PricingController(makePrisma());

    await expect(
      controller.quote({
        pricePerDay: 100,
        nights: 2,
        pickupMethod: 'delivery',
        listingId: 'l1',
      }),
    ).rejects.toThrow('Sign in to get delivery pricing');
  });

  it('rejects delivery pricing when the renter has no address', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      owner: { lat: -33.9249, lng: 18.4241 },
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      lat: null,
      lng: null,
    });
    const controller = new PricingController(prisma);

    await expect(
      controller.quote(
        {
          pricePerDay: 100,
          nights: 2,
          pickupMethod: 'delivery',
          listingId: 'l1',
        },
        renter,
      ),
    ).rejects.toThrow('Add your address');
  });

  it('rejects delivery pricing when the owner has no address', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      owner: { lat: null, lng: null },
    });
    const controller = new PricingController(prisma);

    await expect(
      controller.quote(
        {
          pricePerDay: 100,
          nights: 2,
          pickupMethod: 'delivery',
          listingId: 'l1',
        },
        renter,
      ),
    ).rejects.toThrow('has not set a delivery address');
  });
});
