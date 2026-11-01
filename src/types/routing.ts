export interface Vehicle {
  id: string;
  name: string;
  capacityKg: number;
}

export interface CollectionStop {
  id: string;
  locationId: string;
  locationName: string;
  latitude: number;
  longitude: number;
  expectedWasteKg: number;
  sequence: number;
}

export interface OptimizedRoute {
  vehicleId: string;
  stops: CollectionStop[];
  distanceKm: number;
  durationMinutes: number;
  vehicleUtilizationPercent: number;
}

export interface RouteOptimizationResult {
  generatedAt: string;
  objective: "distance" | "time" | "cost";
  routes: OptimizedRoute[];
  serviceCoveragePercent: number;
}
