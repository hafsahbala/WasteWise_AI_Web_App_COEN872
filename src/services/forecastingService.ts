import { requireBackendService } from "./apiClient";
import type { ForecastRequest, ForecastResult } from "../types/forecast";

export async function requestForecast(
  request: ForecastRequest,
): Promise<ForecastResult> {
  void request;
  return requireBackendService("Forecast generation");
}
