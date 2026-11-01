import { requireBackendService } from "./apiClient";

export interface ReportResult {
  generatedAt: string;
  csvContent?: string;
  pdfUrl?: string;
}

export async function fetchReportData(): Promise<ReportResult> {
  return requireBackendService("Report retrieval");
}
