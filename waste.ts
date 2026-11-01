export type WasteCategory =
  | "Household"
  | "Commercial"
  | "Organic"
  | "Plastic"
  | "Construction"
  | "Other";

export type CollectionStatus = "Pending" | "Collected" | "In progress";

export interface WasteObservation {
  id: string;
  locationName: string;
  latitude?: number;
  longitude?: number;
  observedAt: string;
  category: WasteCategory;
  quantityKg: number;
  collectionStatus: CollectionStatus;
  notes?: string;
  source: "session-only" | "dataset" | "backend";
}

export interface Hotspot {
  id: string;
  locationId: string;
  locationName: string;
  latitude: number;
  longitude: number;
  observedVolumeKg: number;
  observedAt: string;
  severity: "low" | "medium" | "high";
  predictionStatus: "observed" | "predicted";
}
