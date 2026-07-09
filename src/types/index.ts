export type PropertyType = "1RK" | "1BHK" | "2BHK" | "3BHK" | "4BHK" | "PG";

export type Furnishing = "Fully" | "Semi" | "Unfurnished";

export type Availability = "Immediate" | "Within 30 Days";

export type Amenity =
  | "parking"
  | "gym"
  | "pool"
  | "lift"
  | "power"
  | "security"
  | "balcony"
  | "pet"
  | "wifi";

export type UserRole = "rent" | "buy";

export interface WalkBreakdown {
  grocery: number;
  metro: number;
  hospital: number;
}

export interface PricePoint {
  month: string; // "2026-02"
  price: number;
}

export interface Occupant {
  ageRange: string; // "26-30"
  profession: string; // "IT Professional"
  avatar: string;
}

export interface CoLiving {
  occupants: Occupant[];
  totalBeds: number;
  availableBeds: number;
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  bhk: number; // 0 for RK/PG
  rent: number; // monthly in INR
  deposit: number;
  sqft: number;
  locality: string;
  city: string;
  lat: number;
  lng: number;
  furnishing: Furnishing;
  availability: Availability;
  amenities: Amenity[];
  photos: string[];
  ownerName: string;
  ownerQuote: string;
  audioClip: string | null; // path or null = use TTS fallback
  walkScore: number;
  walkBreakdown: WalkBreakdown;
  coLiving: CoLiving | null; // PG only
  priceHistory: PricePoint[];
  localityAvg: number;
  postedDaysAgo: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | null;
  provider: "local" | "google";
  avatar: string;
}

export interface Filters {
  query: string;
  minBudget: number;
  maxBudget: number;
  localities: string[];
  furnishing: Furnishing[];
  availability: Availability[];
  types: PropertyType[];
  amenities: Amenity[];
}

export interface PriceAlert {
  propertyId: string;
  savedPrice: number;
  currentPrice: number;
  dropPercent: number;
}
