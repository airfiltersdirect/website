// AirFiltersDirect — Real Product Catalog
// Design: Clean Air Glassmorphism

export type FilterSize = {
  label: string;
  dimensions: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  partNumbers: string[];
  tagline: string;
  description: string;
  image: string;
  badge: 'merv8' | 'merv11' | 'merv13' | 'humidifier';
  badgeLabel: string;
  features: string[];
  bestFor: string[];
  sizes: FilterSize[];
  popular?: boolean;
  bestValue?: boolean;
  packageNote?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 'ga900',
    name: 'Generalaire GA900',
    partNumbers: ['GA19'],
    tagline: 'Humidifier Pad / Vapor Pad',
    description:
      'Genuine Generalaire replacement humidifier vapor pad. Maintains optimal humidity levels to protect your home and HVAC system.',
    image: 'https://res.cloudinary.com/dtiv4kgyv/image/upload/v1781719944/GA900_tpac0k.png',
    badge: 'humidifier',
    badgeLabel: 'Humidifier Pad',
    features: [
      'Part # GA19 — genuine replacement',
      'Exact size: 12" × 9¾" × 1½"',
      'Maintains healthy indoor humidity',
      'Prevents dry air damage to wood & skin',
      'Easy drop-in installation',
    ],
    bestFor: ['Generalaire humidifiers', 'Whole-home humidity control', 'Winter comfort'],
    packageNote: 'Package of 2',
    sizes: [
      { label: 'Package of 2', dimensions: '12" × 9¾" × 1½"', price: 39.00 },
    ],
  },
  {
    id: 'ga570',
    name: 'Clean Comfort HEP-GA10',
    partNumbers: ['GA570', 'HEP-GA10'],
    tagline: 'Humidifier Vapor Pad for HE12 Models',
    description:
      'OEM-compatible vapor pad for Clean Comfort HE12 humidifiers. Delivers consistent moisture output and long-lasting performance.',
    image: 'https://res.cloudinary.com/dtiv4kgyv/image/upload/v1781719944/GA570_jmqalg.png',
    badge: 'humidifier',
    badgeLabel: 'Humidifier Pad',
    features: [
      'Fits Clean Comfort HE12 humidifiers',
      'Exact size: 10" × 9½" × 1½"',
      'Consistent moisture distribution',
      'Scale-resistant media construction',
      'Recommended annual replacement',
    ],
    bestFor: ['Clean Comfort HE12 owners', 'Humidity maintenance', 'Seasonal replacement'],
    packageNote: 'Package of 2',
    popular: true,
    sizes: [
      { label: 'Package of 2', dimensions: '10" × 9½" × 1½"', price: 45.00 },
    ],
  },
  {
    id: 'aerostar-merv13',
    name: 'Aerostar MERV 13',
    partNumbers: ['Aerostar 16x25x1'],
    tagline: 'Comparable to 3M Filtrete 2200 MPR',
    description:
      'Standard 16×25×1 pleated MERV 13 filters — hospital-grade air quality at a fraction of the cost. Captures bacteria, smoke, and ultrafine particles.',
    image: 'https://res.cloudinary.com/dtiv4kgyv/image/upload/v1781719944/Aerostar_yj8gpv.png',
    badge: 'merv13',
    badgeLabel: 'MERV 13',
    features: [
      'MERV 13 rated — comparable to 3M Filtrete 2200 MPR',
      'Exact size: 15½" × 24½" × ¾"',
      'Captures bacteria, viruses & ultrafine particles',
      'ASHRAE-recommended efficiency level',
      'Electrostatically charged pleated media',
    ],
    bestFor: ['Allergy & asthma sufferers', 'Maximum air quality', 'Pet owners'],
    packageNote: 'Case of 12',
    bestValue: true,
    sizes: [
      { label: 'Case of 12', dimensions: '15½" × 24½" × ¾"', price: 105.00 },
    ],
  },
  {
    id: 'm1-1056',
    name: 'York Cabinet Filter',
    partNumbers: ['M1-1056', 'P102-1625', '918395', 'AMP-M1-1056'],
    tagline: 'MERV 11 — Fits York Filter Cabinets',
    description:
      'High-capacity MERV 11 media filter for York furnace filter cabinets. Up to 1400 CFM airflow capacity with superior allergen capture.',
    image: 'https://res.cloudinary.com/dtiv4kgyv/image/upload/v1781719944/m1-1056_wv2ule.png',
    badge: 'merv11',
    badgeLabel: 'MERV 11',
    features: [
      'Part # M1-1056 / P102-1625 / 918395',
      'Exact size: 15⅜" × 25½" × 5¼"',
      'Fits York YMU1625, YNC1625 cabinets',
      'Up to 1400 CFM airflow capacity',
      '492 FPM MERV 11 efficiency rating',
    ],
    bestFor: ['York furnace owners', 'High-capacity HVAC systems', 'Deep-media filtration'],
    packageNote: 'Case of 3',
    sizes: [
      { label: 'Case of 3', dimensions: '15⅜" × 25½" × 5¼"', price: 89.99 },
    ],
  },
];

export const HVAC_BRANDS = [
  'Carrier', 'Trane', 'Lennox', 'Rheem', 'York', 'Goodman',
  'American Standard', 'Bryant', 'Heil', 'Payne', 'Ruud',
  'Amana', 'Daikin', 'Bosch', 'Mitsubishi', 'Generalaire', 'Clean Comfort', 'Other',
];
