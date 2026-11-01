import { requireBackendService } from "./apiClient";
import type { RouteOptimizationResult } from "../types/routing";

export interface RouteOptimizationRequest {
  vehicleCapacityKg: number;
  objective: "distance" | "time" | "cost";
  shiftHours: number;
}

export async function optimizeCollectionRoutes(
  request: RouteOptimizationRequest,
): Promise<RouteOptimizationResult> {
  void request;
  return requireBackendService("Route optimization");
}
