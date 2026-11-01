export class IntegrationRequiredError extends Error {
  constructor(message = "Backend integration is not configured.") {
    super(message);
    this.name = "IntegrationRequiredError";
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export function requireBackendService(operation: string): never {
  if (!apiBaseUrl) {
    throw new IntegrationRequiredError(
      `${operation} requires a backend API, which is not configured.`,
    );
  }

  throw new IntegrationRequiredError(
    `${operation} is not implemented. Configure its API contract before connecting a backend.`,
  );
}
