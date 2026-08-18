import type { ApiSuccess } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  errors: unknown[];
  data?: Record<string, unknown>;

  constructor(message: string, status: number, errors: unknown[] = [], data?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.data = data;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function api<T>(path: string, options: RequestOptions = {}): Promise<ApiSuccess<T>> {
  const { body, headers, ...rest } = options;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: "Unexpected server response",
  }));

  if (!response.ok) {
    throw new ApiError(
      payload.message ?? "Request failed",
      response.status,
      payload.errors ?? [],
      payload.data
    );
  }

  return payload as ApiSuccess<T>;
}

export function qs(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });
  const value = search.toString();
  return value ? `?${value}` : "";
}

export function otpChallengeFromError(error: unknown) {
  if (!(error instanceof ApiError) || !error.data?.needsVerification || typeof error.data.email !== "string") {
    return null;
  }
  return {
    email: error.data.email,
    purpose: typeof error.data.purpose === "string" ? error.data.purpose : "verify-email",
    otp: typeof error.data.otp === "string" ? error.data.otp : undefined,
  };
}
