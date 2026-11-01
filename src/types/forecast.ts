export interface ForecastPoint {
  timestamp: string;
  locationId: string;
  observedValueKg?: number;
  predictedValueKg: number;
  uncertaintyLowerKg?: number;
  uncertaintyUpperKg?: number;
}

export interface ForecastRequest {
  locationId: string;
  horizonDays: 7 | 14 | 30;
  startDate?: string;
  endDate?: string;
}

export interface ForecastResult {
  generatedAt: string;
  modelName: string;
  points: ForecastPoint[];
}
