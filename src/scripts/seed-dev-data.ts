import type {
  BookingStatus,
  CancellationPolicy,
  CancelledBy,
  DisputeStatus,
  ListingCategory,
  ListingStatus,
  NotificationType,
  PickupMethod,
} from '../../generated/prisma/client';

// Every seeded account uses this domain. Re-running the seed deletes
// exactly these accounts (and everything hanging off them) first, so
// hand-made test accounts in the same dev database are left alone.
export const SEED_EMAIL_DOMAIN = 'gearloop.dev';
export const SEED_PASSWORD = 'gearloop-dev-123';

export interface SeedUser {
  key: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  memberSince: string;
  responseTime?: string;
}

export interface SeedListing {
  key: string;
  ownerKey: string;
  title: string;
  category: ListingCategory;
  country: string;
  pricePerDay: number;
  depositAmount: number;
  cancellationPolicy: CancellationPolicy;
  description: string;
  // Unsplash photo ids, each picked from Unsplash search results whose
  // description matches the item.
  photoIds: string[];
  daysSinceListed: number;
  status?: ListingStatus;
}

export interface SeedReview {
  rating: number;
  comment: string;
}

export interface SeedBooking {
  key: string;
  listingKey: string;
  renterKey: string;
  // Relative to the day the seed runs, so the data never goes stale.
  startInDays: number;
  nights: number;
  status: BookingStatus;
  pickupMethod: PickupMethod;
  renterReview?: SeedReview;
  ownerReview?: SeedReview;
  handoff?: { pickupNote: string; returnNote?: string };
  cancellation?: { by: CancelledBy; reason: string; daysAgo: number };
  dispute?: { status: DisputeStatus; detail: string; claimAmount: number };
}

export interface SeedThread {
  key: string;
  listingKey: string;
  renterKey: string;
  unreadForRenter: boolean;
  unreadForOwner: boolean;
  messages: { from: 'renter' | 'owner'; text: string; minutesAgo: number }[];
}

export interface SeedBlackout {
  listingKey: string;
  startInDays: number;
  nights: number;
  reason: string;
}

export interface SeedNotification {
  userKey: string;
  type: NotificationType;
  title: string;
  body: string;
  link: { bookingKey: string } | { threadKey: string };
  read: boolean;
  hoursAgo: number;
}

// The demo account: owns two listings and rents from others, so both the
// renter and owner dashboards have something in every state.
export const DEMO_USER_KEY = 'sara';

export const users: SeedUser[] = [
  {
    key: 'sara',
    name: 'Sara Malik',
    address: 'Khayaban-e-Ittehad, DHA Phase 6, Karachi',
    lat: 24.7925,
    lng: 67.065,
    memberSince: '2025-03-14',
    responseTime: 'Usually replies within an hour',
  },
  {
    key: 'ayesha',
    name: 'Ayesha Khan',
    address: 'Block 5, Clifton, Karachi',
    lat: 24.8138,
    lng: 67.03,
    memberSince: '2024-11-02',
    responseTime: 'Usually replies within 30 minutes',
  },
  {
    key: 'usman',
    name: 'Usman Sheikh',
    address: 'PECHS Block 6, Shahrah-e-Faisal, Karachi',
    lat: 24.865,
    lng: 67.07,
    memberSince: '2025-01-20',
    responseTime: 'Usually replies within a few hours',
  },
  {
    key: 'zain',
    name: 'Zain Raza',
    address: 'Gulshan-e-Iqbal Block 13-D, Karachi',
    lat: 24.92,
    lng: 67.095,
    memberSince: '2025-05-08',
  },
  {
    key: 'fatima',
    name: 'Fatima Qureshi',
    address: 'Bahadurabad, Karachi',
    lat: 24.882,
    lng: 67.07,
    memberSince: '2025-06-11',
  },
  {
    key: 'bilal',
    name: 'Bilal Ahmed',
    address: 'Main Boulevard, Gulberg III, Lahore',
    lat: 31.5104,
    lng: 74.3416,
    memberSince: '2024-08-19',
    responseTime: 'Usually replies within 2 hours',
  },
  {
    key: 'hamza',
    name: 'Hamza Siddiqui',
    address: 'Street 21, F-7/2, Islamabad',
    lat: 33.7215,
    lng: 73.056,
    memberSince: '2024-06-03',
    responseTime: 'Usually replies within an hour',
  },
  {
    key: 'omar',
    name: 'Omar Al Mansoori',
    address: 'Marina Promenade, Dubai Marina, Dubai',
    lat: 25.08,
    lng: 55.14,
    memberSince: '2024-09-27',
    responseTime: 'Usually replies within an hour',
  },
  {
    key: 'priya',
    name: 'Priya Nair',
    address: 'Cluster T, Jumeirah Lake Towers, Dubai',
    lat: 25.07,
    lng: 55.145,
    memberSince: '2024-12-15',
    responseTime: 'Usually replies within 30 minutes',
  },
  {
    key: 'aisha',
    name: 'Aisha Rahman',
    address: 'Al Barsha 1, Dubai',
    lat: 25.113,
    lng: 55.196,
    memberSince: '2025-04-02',
  },
  {
    key: 'james',
    name: 'James Whitfield',
    address: 'Mare Street, Hackney, London E8',
    lat: 51.545,
    lng: -0.0553,
    memberSince: '2024-07-09',
    responseTime: 'Usually replies within a few hours',
  },
  {
    key: 'sophie',
    name: 'Sophie Bennett',
    address: 'Ancoats, Manchester M4',
    lat: 53.484,
    lng: -2.23,
    memberSince: '2025-02-22',
    responseTime: 'Usually replies within 2 hours',
  },
  {
    key: 'daniel',
    name: 'Daniel Brooks',
    address: 'Bethnal Green Road, London E2',
    lat: 51.527,
    lng: -0.055,
    memberSince: '2025-05-30',
  },
  {
    key: 'marcus',
    name: 'Marcus Johnson',
    address: 'East Cesar Chavez St, Austin, TX',
    lat: 30.256,
    lng: -97.73,
    memberSince: '2024-10-04',
    responseTime: 'Usually replies within an hour',
  },
  {
    key: 'emily',
    name: 'Emily Chen',
    address: 'SE Hawthorne Blvd, Portland, OR',
    lat: 45.512,
    lng: -122.63,
    memberSince: '2024-05-17',
    responseTime: 'Usually replies within 30 minutes',
  },
  {
    key: 'noah',
    name: 'Noah Williams',
    address: 'South Congress Ave, Austin, TX',
    lat: 30.245,
    lng: -97.75,
    memberSince: '2025-07-01',
  },
];

export function unsplashUrl(photoId: string): string {
  return `https://images.unsplash.com/photo-${photoId}?w=1200&q=80&auto=format&fit=crop`;
}

export const listings: SeedListing[] = [
  {
    key: 'ayesha-a7iv',
    ownerKey: 'ayesha',
    title: 'Sony A7 IV with 28-70mm kit lens',
    category: 'Cameras',
    country: 'PK',
    pricePerDay: 7500,
    depositAmount: 75000,
    cancellationPolicy: 'moderate',
    description:
      'Full-frame 33MP mirrorless body that shoots 4K 60p — my go-to for weddings and events. Comes with the 28-70mm lens, two batteries, a 128GB SD card, charger and a padded Peak Design bag. Sensor was professionally cleaned last month.',
    photoIds: ['1516035069371-29a1b244cc32', '1552233707-a3185320d9a0'],
    daysSinceListed: 120,
  },
  {
    key: 'ayesha-mini4',
    ownerKey: 'ayesha',
    title: 'DJI Mini 4 Pro Fly More combo',
    category: 'Cameras',
    country: 'PK',
    pricePerDay: 6000,
    depositAmount: 60000,
    cancellationPolicy: 'strict',
    description:
      'Under-249g drone with omnidirectional obstacle sensing and 4K/60 HDR video. The Fly More combo includes three batteries (roughly 90 minutes of flight), the charging hub, spare props and the RC 2 controller with a built-in screen. Please check local flying rules before your shoot.',
    photoIds: ['1527977966376-1c8408f9f108', '1473968512647-3e447244af8f'],
    daysSinceListed: 60,
  },
  {
    key: 'ayesha-70200',
    ownerKey: 'ayesha',
    title: 'Canon EF 70-200mm f/2.8L IS III',
    category: 'Cameras',
    country: 'PK',
    pricePerDay: 3500,
    depositAmount: 45000,
    cancellationPolicy: 'moderate',
    description:
      'The classic sports and portrait telephoto. Weather-sealed, fast autofocus and excellent stabilisation. Comes with front and rear caps, the hood and the tripod collar. EF mount — works on RF bodies with an adapter (not included).',
    photoIds: ['1580707221190-bd94d9087b7f', '1502982720700-bfff97f2ecac'],
    daysSinceListed: 90,
  },
  {
    key: 'usman-washer',
    ownerKey: 'usman',
    title: 'Kärcher K5 pressure washer',
    category: 'PowerTools',
    country: 'PK',
    pricePerDay: 2000,
    depositAmount: 10000,
    cancellationPolicy: 'flexible',
    description:
      'Perfect for driveways, car porches, water tanks and outdoor furniture before Eid. 145 bar max pressure with the Vario and dirt-blaster lances, 8m hose and a bottle of patio cleaner. I can show you how to set it up at pickup.',
    photoIds: ['1782235869457-069673be2dc3', '1782235869345-18e03baf7f5b'],
    daysSinceListed: 75,
  },
  {
    key: 'usman-drill',
    ownerKey: 'usman',
    title: 'Bosch 18V combi drill with 2 batteries',
    category: 'PowerTools',
    country: 'PK',
    pricePerDay: 1200,
    depositAmount: 8000,
    cancellationPolicy: 'flexible',
    description:
      'Cordless hammer drill that handles brick and concrete for curtain rods, shelves and AC brackets. Two 2.0Ah batteries, fast charger, and a 35-piece drill and screwdriver bit set in a carry case.',
    photoIds: ['1590635023142-73c3d34f2805', '1606676539940-12768ce0e762'],
    daysSinceListed: 100,
  },
  {
    key: 'usman-generator',
    ownerKey: 'usman',
    title: 'Honda EU22i inverter generator',
    category: 'PowerTools',
    country: 'PK',
    pricePerDay: 4500,
    depositAmount: 40000,
    cancellationPolicy: 'moderate',
    description:
      'Quiet 2.2kW inverter generator — clean enough power for laptops, lights and a fridge during load-shedding or at an outdoor event. Runs around 8 hours on a tank at quarter load. Delivered with a full tank and a 10m extension lead.',
    photoIds: ['1700318092011-6e4666e94ab5', '1700318131252-ab19c871ab60'],
    daysSinceListed: 30,
  },
  {
    key: 'sara-gopro',
    ownerKey: 'sara',
    title: 'GoPro HERO12 Black with mounts',
    category: 'Cameras',
    country: 'PK',
    pricePerDay: 2500,
    depositAmount: 20000,
    cancellationPolicy: 'flexible',
    description:
      'Waterproof to 10m without a housing, so it is great for snorkelling at Churna or a bike-mounted ride. Includes the Media Mod, chest and helmet mounts, a floating hand grip, two Enduro batteries and a 64GB card.',
    photoIds: ['1490971269589-386b2934c495', '1532877590696-69a157b92b78'],
    daysSinceListed: 45,
  },
  {
    key: 'sara-bike',
    ownerKey: 'sara',
    title: 'Trek Marlin 7 mountain bike (size M)',
    category: 'Bikes',
    country: 'PK',
    pricePerDay: 3000,
    depositAmount: 25000,
    cancellationPolicy: 'moderate',
    description:
      'Hardtail trail bike with hydraulic disc brakes and a 1x10 drivetrain — fits riders roughly 5\'5" to 5\'10". Serviced in September. Comes with a helmet, lock and a mini pump. Ideal for the Karachi Bike Trail or a weekend in the northern areas.',
    photoIds: ['1511994298241-608e28f14fde', '1535369643553-a33e0d1ac81d'],
    daysSinceListed: 150,
  },
  {
    key: 'bilal-saw',
    ownerKey: 'bilal',
    title: 'Makita 7¼" circular saw',
    category: 'PowerTools',
    country: 'PK',
    pricePerDay: 1500,
    depositAmount: 12000,
    cancellationPolicy: 'moderate',
    description:
      '1200W corded circular saw with a fresh 24-tooth blade. Cuts plywood, MDF and timber up to 66mm deep. Includes the rip fence and a spare blade. Bring your own safety glasses or borrow mine.',
    photoIds: ['1513467535987-fd81bc7d62f8', '1767389193137-77d6f9b8b56a'],
    daysSinceListed: 80,
  },
  {
    key: 'bilal-roadbike',
    ownerKey: 'bilal',
    title: 'Giant Contend road bike, 54cm',
    category: 'Bikes',
    country: 'PK',
    pricePerDay: 2800,
    depositAmount: 30000,
    cancellationPolicy: 'moderate',
    description:
      'Lightweight aluminium road bike with Shimano Claris gearing — great for early-morning rides along the canal. Flat pedals fitted (SPD pedals available on request). Helmet and bottle cage included.',
    photoIds: ['1532298229144-0ec0c57515c7', '1534787238916-9ba6764efd4f'],
    daysSinceListed: 55,
  },
  {
    key: 'hamza-tent',
    ownerKey: 'hamza',
    title: 'Coleman Sundome 4-person tent',
    category: 'CampingGear',
    country: 'PK',
    pricePerDay: 1800,
    depositAmount: 10000,
    cancellationPolicy: 'moderate',
    description:
      'Easy two-pole dome tent that goes up in about ten minutes. Sleeps four, with a rainfly and a ground sheet. Has done Shogran, Naltar and Fairy Meadows. Pegs, mallet and a repair kit are in the bag.',
    photoIds: ['1504280390367-361c6d9f38f4', '1624923686627-514dd5e57bae'],
    daysSinceListed: 140,
  },
  {
    key: 'hamza-kit',
    ownerKey: 'hamza',
    title: 'Complete camping kit for two',
    category: 'CampingGear',
    country: 'PK',
    pricePerDay: 3500,
    depositAmount: 20000,
    cancellationPolicy: 'moderate',
    description:
      'Everything for a weekend trip: 2-person tent, two sleeping bags rated to 0°C, inflatable mats, a gas stove with a cooking set, headlamps and two folding chairs. Gas canisters are not included.',
    photoIds: ['1534880606858-29b0e8a24e8d', '1761599934469-999a86c52830'],
    daysSinceListed: 70,
  },
  {
    key: 'hamza-lantern',
    ownerKey: 'hamza',
    title: 'Petromax HK500 pressure lantern',
    category: 'CampingGear',
    country: 'PK',
    pricePerDay: 800,
    depositAmount: 5000,
    cancellationPolicy: 'flexible',
    description:
      'Classic brass kerosene lantern — bright enough to light a whole campsite. Comes with spare mantles and a funnel.',
    photoIds: ['1555488205-d5e67846cf40', '1512456489623-977da999566b'],
    daysSinceListed: 2,
    status: 'pending',
  },
  {
    key: 'omar-ebike',
    ownerKey: 'omar',
    title: 'Rad Power RadCity 5 Plus e-bike',
    category: 'Bikes',
    country: 'AE',
    pricePerDay: 150,
    depositAmount: 1500,
    cancellationPolicy: 'moderate',
    description:
      'Commuter e-bike with roughly 70km of range on pedal assist — easily covers the Marina to Kite Beach and back. Includes a helmet, a heavy-duty lock and the charger. Battery is fully charged at handover.',
    photoIds: ['1786441113553-43414b842378', '1719885959196-03139e36d22c'],
    daysSinceListed: 110,
  },
  {
    key: 'omar-road',
    ownerKey: 'omar',
    title: 'Specialized Allez Sport road bike',
    category: 'Bikes',
    country: 'AE',
    pricePerDay: 110,
    depositAmount: 1200,
    cancellationPolicy: 'flexible',
    description:
      'Aluminium road bike in size 56, set up for the Al Qudra cycle track. Includes two bottle cages, a saddle bag with a spare tube and a set of lights for early starts.',
    photoIds: ['1576435728678-68d0fbf94e91', '1786916901401-338c6ce2e6de'],
    daysSinceListed: 40,
  },
  {
    key: 'priya-r6',
    ownerKey: 'priya',
    title: 'Canon EOS R6 Mark II body',
    category: 'Cameras',
    country: 'AE',
    pricePerDay: 220,
    depositAmount: 3000,
    cancellationPolicy: 'strict',
    description:
      '24MP full-frame body with outstanding low-light autofocus — ideal for events and desert night shoots. Includes three LP-E6NH batteries, a dual charger and a 256GB CFexpress card.',
    photoIds: ['1500634245200-e5245c7574ef', '1512790182412-b19e6d62bc39'],
    daysSinceListed: 95,
  },
  {
    key: 'priya-mavic',
    ownerKey: 'priya',
    title: 'DJI Mavic 3 Classic',
    category: 'Cameras',
    country: 'AE',
    pricePerDay: 260,
    depositAmount: 4000,
    cancellationPolicy: 'strict',
    description:
      'Hasselblad 4/3 sensor drone with 46 minutes of flight time per battery. Paused while it is in for its annual service.',
    photoIds: ['1507582020474-9a35b7d455d9', '1506947411487-a56738267384'],
    daysSinceListed: 20,
    status: 'paused',
  },
  {
    key: 'priya-desert',
    ownerKey: 'priya',
    title: 'Desert camping set for four',
    category: 'CampingGear',
    country: 'AE',
    pricePerDay: 180,
    depositAmount: 800,
    cancellationPolicy: 'moderate',
    description:
      'A 4-person tent with sand pegs, four camping chairs, a folding table, a 45L cool box and a portable gas grill. Everything fits in an SUV boot — perfect for a night out near Al Qudra Lakes in the cooler months.',
    photoIds: ['1625834509314-3b12c6153624', '1471115853179-bb1d604434e0'],
    daysSinceListed: 50,
  },
  {
    key: 'james-brompton',
    ownerKey: 'james',
    title: 'Brompton C Line folding bike',
    category: 'Bikes',
    country: 'GB',
    pricePerDay: 25,
    depositAmount: 300,
    cancellationPolicy: 'flexible',
    description:
      'Six-speed Brompton that folds in about 20 seconds — takes it on the Overground and into the office without any fuss. Comes with front and rear lights, a D-lock and the front carrier bag.',
    photoIds: ['1772109065037-e2343d2cbce9', '1772109065028-7c261692faa9'],
    daysSinceListed: 130,
  },
  {
    key: 'james-xt5',
    ownerKey: 'james',
    title: 'Fujifilm X-T5 with 18-55mm lens',
    category: 'Cameras',
    country: 'GB',
    pricePerDay: 45,
    depositAmount: 600,
    cancellationPolicy: 'moderate',
    description:
      '40MP APS-C body with Fuji film simulations, so the JPEGs look great straight out of the camera. Includes the 18-55mm f/2.8-4 lens, two batteries, a 128GB card and a wrist strap.',
    photoIds: ['1452780212940-6f5c0d14d848', '1516724562728-afc824a36e84'],
    daysSinceListed: 65,
  },
  {
    key: 'sophie-tent',
    ownerKey: 'sophie',
    title: 'Vango Odyssey Air 600 family tent',
    category: 'CampingGear',
    country: 'GB',
    pricePerDay: 30,
    depositAmount: 200,
    cancellationPolicy: 'moderate',
    description:
      'Inflatable-beam tent for six with three bedrooms and a large living area — pitched in about 15 minutes with the pump included. Used for the Lake District and Snowdonia. Carpet and footprint included.',
    photoIds: ['1576176539998-0237d1ac6a85', '1602391833977-358a52198938'],
    daysSinceListed: 85,
  },
  {
    key: 'sophie-drill',
    ownerKey: 'sophie',
    title: 'DeWalt 18V XR combi drill set',
    category: 'PowerTools',
    country: 'GB',
    pricePerDay: 15,
    depositAmount: 120,
    cancellationPolicy: 'flexible',
    description:
      'Brushless combi drill with two 2Ah batteries and a fast charger. Includes a 70-piece bit set — enough for flat-pack furniture, shelves and curtain poles.',
    photoIds: ['1572981779307-38b8cabb2407', '1546827209-a218e99fdbe9'],
    daysSinceListed: 35,
  },
  {
    key: 'marcus-chainsaw',
    ownerKey: 'marcus',
    title: 'Stihl MS 250 chainsaw, 18" bar',
    category: 'PowerTools',
    country: 'US',
    pricePerDay: 55,
    depositAmount: 300,
    cancellationPolicy: 'strict',
    description:
      'Reliable mid-size gas chainsaw for storm clean-up and firewood. Freshly sharpened chain, a full can of 50:1 mix, bar oil, chaps and a face shield are included. Must be 18+ to rent.',
    photoIds: ['1625337905972-56fb1efe20a3', '1696883186987-299ff16b0cac'],
    daysSinceListed: 90,
  },
  {
    key: 'marcus-impact',
    ownerKey: 'marcus',
    title: 'Milwaukee M18 FUEL drill and impact driver kit',
    category: 'PowerTools',
    country: 'US',
    pricePerDay: 25,
    depositAmount: 150,
    cancellationPolicy: 'flexible',
    description:
      'Hammer drill plus impact driver, two 5.0Ah batteries and a rapid charger in a Packout case. Handles deck screws, lag bolts and masonry anchors without breaking a sweat.',
    photoIds: ['1776711763505-4105861e0d41', '1504148455328-c376907d081c'],
    daysSinceListed: 25,
  },
  {
    key: 'emily-halfdome',
    ownerKey: 'emily',
    title: 'REI Half Dome SL 2+ backpacking tent',
    category: 'CampingGear',
    country: 'US',
    pricePerDay: 25,
    depositAmount: 150,
    cancellationPolicy: 'moderate',
    description:
      'Roomy two-person backpacking tent at about 4.5 lb, with two doors and two vestibules. Footprint included. Great for Mount Hood and Gorge trips.',
    photoIds: ['1510312305653-8ed496efae75', '1537905569824-f89f14cceb68'],
    daysSinceListed: 115,
  },
  {
    key: 'emily-mtb',
    ownerKey: 'emily',
    title: 'Santa Cruz Hightower full-suspension MTB (L)',
    category: 'Bikes',
    country: 'US',
    pricePerDay: 85,
    depositAmount: 1000,
    cancellationPolicy: 'strict',
    description:
      '29er enduro bike with 150mm rear travel, a dropper post and SRAM GX Eagle. Tuned for Sandy Ridge — suspension set up for riders around 160-190 lb. Helmet and knee pads available on request.',
    photoIds: ['1673121414328-52eff37bc6d0', '1633707167682-9068729bc84c'],
    daysSinceListed: 60,
  },
];

export const bookings: SeedBooking[] = [
  {
    key: 'sara-a7iv',
    listingKey: 'ayesha-a7iv',
    renterKey: 'sara',
    startInDays: -40,
    nights: 3,
    status: 'completed',
    pickupMethod: 'pickup',
    handoff: {
      pickupNote: 'Body, lens, two batteries and bag. No marks on the screen.',
      returnNote: 'Returned clean, all accessories accounted for.',
    },
    renterReview: {
      rating: 5,
      comment:
        "Camera was spotless and Ayesha walked me through her custom settings. Made my cousin's mehndi shoot so much easier.",
    },
    ownerReview: {
      rating: 5,
      comment: 'Sara looked after the kit really well and returned it on time.',
    },
  },
  {
    key: 'sara-washer',
    listingKey: 'usman-washer',
    renterKey: 'sara',
    startInDays: 6,
    nights: 2,
    status: 'confirmed',
    pickupMethod: 'delivery',
  },
  {
    key: 'sara-mini4',
    listingKey: 'ayesha-mini4',
    renterKey: 'sara',
    startInDays: 14,
    nights: 3,
    status: 'pending',
    pickupMethod: 'pickup',
  },
  {
    key: 'sara-drill',
    listingKey: 'usman-drill',
    renterKey: 'sara',
    startInDays: 2,
    nights: 2,
    status: 'cancelled',
    pickupMethod: 'pickup',
    cancellation: {
      by: 'renter',
      reason: 'The contractor ended up bringing his own tools.',
      daysAgo: 4,
    },
  },
  {
    key: 'sara-tent',
    listingKey: 'hamza-tent',
    renterKey: 'sara',
    startInDays: -18,
    nights: 4,
    status: 'completed',
    pickupMethod: 'pickup',
    handoff: {
      pickupNote: 'Tent, rainfly, ground sheet, 12 pegs and mallet.',
      returnNote: 'Rainfly has a 10cm tear next to the front zip.',
    },
    dispute: {
      status: 'under_review',
      detail:
        'The rainfly came back with a 10cm tear beside the front door zip. A replacement fly costs about PKR 4,000.',
      claimAmount: 4000,
    },
  },
  {
    key: 'zain-gopro',
    listingKey: 'sara-gopro',
    renterKey: 'zain',
    startInDays: 9,
    nights: 2,
    status: 'pending',
    pickupMethod: 'pickup',
  },
  {
    key: 'zain-bike',
    listingKey: 'sara-bike',
    renterKey: 'zain',
    startInDays: 3,
    nights: 1,
    status: 'confirmed',
    pickupMethod: 'pickup',
  },
  {
    key: 'fatima-bike',
    listingKey: 'sara-bike',
    renterKey: 'fatima',
    startInDays: -25,
    nights: 2,
    status: 'completed',
    pickupMethod: 'pickup',
    handoff: {
      pickupNote: 'Bike, helmet, lock and pump. Tyres at 30 psi.',
      returnNote: 'Muddy but no damage — all good.',
    },
    renterReview: {
      rating: 5,
      comment:
        'Bike was perfectly tuned and Sara even adjusted the saddle height for me. Will rent again.',
    },
    ownerReview: {
      rating: 5,
      comment: 'Lovely renter, great communication.',
    },
  },
  {
    key: 'zain-bike-old',
    listingKey: 'sara-bike',
    renterKey: 'zain',
    startInDays: -60,
    nights: 3,
    status: 'completed',
    pickupMethod: 'pickup',
    renterReview: {
      rating: 4,
      comment: 'Great bike. Pickup was a bit late but Sara let me know ahead.',
    },
    ownerReview: { rating: 5, comment: 'Returned in great shape.' },
  },
  {
    key: 'zain-a7iv',
    listingKey: 'ayesha-a7iv',
    renterKey: 'zain',
    startInDays: -75,
    nights: 2,
    status: 'completed',
    pickupMethod: 'pickup',
    renterReview: {
      rating: 5,
      comment: 'Exactly as described. The extra batteries were a lifesaver.',
    },
  },
  {
    key: 'fatima-70200',
    listingKey: 'ayesha-70200',
    renterKey: 'fatima',
    startInDays: -30,
    nights: 3,
    status: 'completed',
    pickupMethod: 'pickup',
    renterReview: {
      rating: 4,
      comment:
        'Super sharp lens. Heavier than I expected, so bring a proper strap!',
    },
  },
  {
    key: 'zain-generator',
    listingKey: 'usman-generator',
    renterKey: 'zain',
    startInDays: 1,
    nights: 2,
    status: 'confirmed',
    pickupMethod: 'delivery',
  },
  {
    key: 'aisha-ebike',
    listingKey: 'omar-ebike',
    renterKey: 'aisha',
    startInDays: -20,
    nights: 3,
    status: 'completed',
    pickupMethod: 'pickup',
    renterReview: {
      rating: 5,
      comment:
        'Rode it to Kite Beach and back with battery to spare. Omar was very helpful.',
    },
    ownerReview: { rating: 5, comment: 'Returned charged and clean. Thanks!' },
  },
  {
    key: 'aisha-r6',
    listingKey: 'priya-r6',
    renterKey: 'aisha',
    startInDays: -45,
    nights: 2,
    status: 'completed',
    pickupMethod: 'pickup',
    renterReview: {
      rating: 5,
      comment:
        'Autofocus is unreal in low light. Priya packed everything neatly.',
    },
  },
  {
    key: 'aisha-desert',
    listingKey: 'priya-desert',
    renterKey: 'aisha',
    startInDays: 12,
    nights: 2,
    status: 'confirmed',
    pickupMethod: 'pickup',
  },
  {
    key: 'daniel-brompton',
    listingKey: 'james-brompton',
    renterKey: 'daniel',
    startInDays: -15,
    nights: 5,
    status: 'completed',
    pickupMethod: 'pickup',
    renterReview: {
      rating: 5,
      comment:
        'Made my week of commuting so much easier. Folded under my desk every day.',
    },
    ownerReview: {
      rating: 5,
      comment: 'Great renter, would happily rent again.',
    },
  },
  {
    key: 'daniel-xt5',
    listingKey: 'james-xt5',
    renterKey: 'daniel',
    startInDays: 8,
    nights: 3,
    status: 'pending',
    pickupMethod: 'pickup',
  },
  {
    key: 'daniel-tent',
    listingKey: 'sophie-tent',
    renterKey: 'daniel',
    startInDays: -50,
    nights: 3,
    status: 'completed',
    pickupMethod: 'pickup',
    renterReview: {
      rating: 4,
      comment:
        'Huge tent and easy to pitch. It is heavy though — you need a car.',
    },
  },
  {
    key: 'noah-chainsaw',
    listingKey: 'marcus-chainsaw',
    renterKey: 'noah',
    startInDays: 4,
    nights: 1,
    status: 'confirmed',
    pickupMethod: 'pickup',
  },
  {
    key: 'noah-halfdome',
    listingKey: 'emily-halfdome',
    renterKey: 'noah',
    startInDays: -35,
    nights: 4,
    status: 'completed',
    pickupMethod: 'pickup',
    renterReview: {
      rating: 5,
      comment: 'Light, roomy and bone dry through a night of rain.',
    },
    ownerReview: { rating: 5, comment: 'Packed it back up perfectly.' },
  },
  {
    key: 'noah-impact',
    listingKey: 'marcus-impact',
    renterKey: 'noah',
    startInDays: -10,
    nights: 2,
    status: 'completed',
    pickupMethod: 'pickup',
    renterReview: {
      rating: 5,
      comment: 'Built a whole deck in a weekend with this kit.',
    },
  },
];

export const threads: SeedThread[] = [
  {
    key: 'sara-mini4',
    listingKey: 'ayesha-mini4',
    renterKey: 'sara',
    unreadForRenter: true,
    unreadForOwner: false,
    messages: [
      {
        from: 'renter',
        text: "Hi Ayesha! Is the Mini 4 Pro free from the 14th? I'm planning a sunrise shoot at Hawke's Bay.",
        minutesAgo: 300,
      },
      {
        from: 'owner',
        text: 'Hi Sara, yes those dates are open. The combo has three batteries, which is about 90 minutes of flying.',
        minutesAgo: 140,
      },
      {
        from: 'owner',
        text: "I'll confirm your request tonight once I'm home and have checked the props.",
        minutesAgo: 120,
      },
    ],
  },
  {
    key: 'zain-gopro',
    listingKey: 'sara-gopro',
    renterKey: 'zain',
    unreadForRenter: false,
    unreadForOwner: true,
    messages: [
      {
        from: 'renter',
        text: 'Salam! Does the GoPro come with a chest mount? Taking it snorkelling at Churna.',
        minutesAgo: 420,
      },
      {
        from: 'owner',
        text: 'Walaikum salam! Yes, chest and helmet mounts plus a floating grip so it will not sink.',
        minutesAgo: 390,
      },
      {
        from: 'renter',
        text: 'Perfect. Could I pick it up the evening before, around 8pm?',
        minutesAgo: 35,
      },
    ],
  },
  {
    key: 'sara-a7iv',
    listingKey: 'ayesha-a7iv',
    renterKey: 'sara',
    unreadForRenter: false,
    unreadForOwner: false,
    messages: [
      {
        from: 'renter',
        text: 'Dropped the camera back at your gate — thanks so much, the shoot went brilliantly!',
        minutesAgo: 36 * 24 * 60,
      },
      {
        from: 'owner',
        text: 'Got it, all in perfect shape. Glad it went well, rent anytime!',
        minutesAgo: 36 * 24 * 60 - 45,
      },
    ],
  },
  {
    key: 'daniel-xt5',
    listingKey: 'james-xt5',
    renterKey: 'daniel',
    unreadForRenter: false,
    unreadForOwner: false,
    messages: [
      {
        from: 'renter',
        text: 'Hi James, would an 8am pickup on the first day work? I have a shoot in Victoria Park at 10.',
        minutesAgo: 1500,
      },
      {
        from: 'owner',
        text: "8am is fine, I'm in from 7. I'll charge both batteries the night before.",
        minutesAgo: 1440,
      },
    ],
  },
  {
    key: 'noah-chainsaw',
    listingKey: 'marcus-chainsaw',
    renterKey: 'noah',
    unreadForRenter: false,
    unreadForOwner: false,
    messages: [
      {
        from: 'renter',
        text: 'Hey Marcus, the oak that came down in the storm is about 14" across. Is the 18" bar okay for that?',
        minutesAgo: 2880,
      },
      {
        from: 'owner',
        text: "Plenty. I'll throw in a felling wedge too, just in case.",
        minutesAgo: 2800,
      },
    ],
  },
];

export const blackouts: SeedBlackout[] = [
  {
    listingKey: 'ayesha-a7iv',
    startInDays: 20,
    nights: 3,
    reason: 'Wedding shoot in Lahore',
  },
  {
    listingKey: 'james-brompton',
    startInDays: 25,
    nights: 7,
    reason: 'Away on holiday',
  },
  {
    listingKey: 'sara-bike',
    startInDays: 30,
    nights: 2,
    reason: 'Personal use — weekend ride',
  },
];

export const notifications: SeedNotification[] = [
  {
    userKey: 'sara',
    type: 'message_received',
    title: 'New message from Ayesha Khan',
    body: "I'll confirm your request tonight once I'm home and have checked the props.",
    link: { threadKey: 'sara-mini4' },
    read: false,
    hoursAgo: 2,
  },
  {
    userKey: 'sara',
    type: 'booking_requested',
    title: 'New booking request for GoPro HERO12 Black with mounts',
    body: 'Zain Raza wants to rent it for 2 nights.',
    link: { bookingKey: 'zain-gopro' },
    read: false,
    hoursAgo: 7,
  },
  {
    userKey: 'sara',
    type: 'booking_confirmed',
    title: 'Your booking for Kärcher K5 pressure washer is confirmed',
    body: 'Usman Sheikh accepted your request. It will be delivered to your address.',
    link: { bookingKey: 'sara-washer' },
    read: false,
    hoursAgo: 20,
  },
  {
    userKey: 'sara',
    type: 'dispute_filed',
    title: 'A dispute was filed on your Coleman Sundome booking',
    body: 'A claim of 4000 against your deposit: the rainfly came back with a 10cm tear.',
    link: { bookingKey: 'sara-tent' },
    read: true,
    hoursAgo: 24 * 12,
  },
  {
    userKey: 'sara',
    type: 'deposit_released',
    title: 'Your deposit for Sony A7 IV has been released',
    body: 'The camera was returned in good condition, so your deposit hold has been released.',
    link: { bookingKey: 'sara-a7iv' },
    read: true,
    hoursAgo: 24 * 36,
  },
];
