import { requireBackendService } from "./apiClient";
import type { WasteObservation } from "../types/waste";

export async function fetchWasteObservations(): Promise<WasteObservation[]> {
  return requireBackendService("Waste observation retrieval");
}

export async function fetchHotspots(): Promise<import("../types/waste").Hotspot[]> {
  return requireBackendService("Hotspot retrieval");
}
