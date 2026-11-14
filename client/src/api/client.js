/**
 * NURA Centralized API Client
 *
 * Provides a standardized fetch-based client for communicating with the
 * NURA Express backend API (/api/v1).
 *
 * Key Architectural Features:
 * - Environment-configurable API base URL with Vite proxy fallback (`/api/v1`)
 * - Automatic Authorization: Bearer token injection using a single authoritative source
 * - Connectable to future AuthContext via setTokenProvider() without competing storage
 * - Robust handling for JSON and non-JSON (HTML/text) server and gateway responses
 * - Normalized ApiError format mapping directly to backend error schemas
 * - Safe 401 Unauthorized handling that avoids infinite redirect loops
 * - Sanitized error objects to prevent credential or token exposure in logs
 * - Extensible resource service modules for auth, users, cycles, symptoms, reminders, and insights
 */

export const TOKEN_STORAGE_KEY = "nura_auth_token";

let customTokenGetter = null;
let unauthorizedListener = null;

/**
 * Configure an external token provider (e.g. from a future AuthContext).
 * @param {(() => string | null) | null} provider
 */
export const setTokenProvider = (provider) => {
  customTokenGetter = typeof provider === "function" ? provider : null;
};

/**
 * Register a listener for 401 Unauthorized events (e.g. to trigger session expiry UI).
 * @param {((response: Response) => void) | null} handler
 */
export const setUnauthorizedHandler = (handler) => {
  unauthorizedListener = typeof handler === "function" ? handler : null;
};

/**
 * Retrieves the current authentication token from either the custom provider
 * or local storage fallback.
 * @returns {string | null}
 */
export const getStoredToken = () => {
  if (customTokenGetter) {
    try {
      const token = customTokenGetter();
      if (token) return token;
    } catch {
      // Fallback silently to localStorage if provider fails
    }
  }

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return window.localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  return null;
};

/**
 * Stores or clears the authentication token in the authoritative storage.
 * @param {string | null} token
 */
export const setStoredToken = (token) => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      if (token) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch {
      // Storage access may fail in restricted browsing contexts
    }
  }
};

/**
 * Removes the stored authentication token.
 */
export const removeStoredToken = () => {
  setStoredToken(null);
};

/**
 * Custom Error class for normalized API errors.
 */
export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {any} [data]
   * @param {Array<{ field: string, message: string }> | null} [errors]
   */
  constructor(message, status = 500, data = null, errors = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.errors = errors;
  }
}

/**
 * Resolves the API base URL from Vite environment variables or defaults to proxy path.
 * @returns {string}
 */
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env?.VITE_API_BASE_URL;
  if (typeof envUrl === "string" && envUrl.trim() !== "") {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return "/api/v1";
};

/**
 * Constructs a full URL with query parameters.
 * @param {string} endpoint
 * @param {Record<string, any>} [params]
 * @returns {string}
 */
export const buildUrl = (endpoint, params) => {
  const base = getApiBaseUrl();
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${base}${path}`;

  if (!params || typeof params !== "object") {
    return fullUrl;
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `${fullUrl}?${queryString}` : fullUrl;
};

/**
 * Core HTTP request handler.
 *
 * @param {string} endpoint - API path relative to base URL (e.g. '/cycles')
 * @param {Object} [options]
 * @param {string} [options.method='GET']
 * @param {HeadersInit} [options.headers]
 * @param {any} [options.body]
 * @param {Record<string, any>} [options.params]
 * @param {AbortSignal} [options.signal]
 * @param {boolean} [options.skipAuth=false]
 * @returns {Promise<any>}
 */
export async function request(endpoint, options = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    params,
    signal,
    skipAuth = false,
    ...customConfig
  } = options;

  const url = buildUrl(endpoint, params);
  const requestHeaders = new Headers(headers);

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const isBlob = typeof Blob !== "undefined" && body instanceof Blob;

  // Set default JSON Content-Type when body is present and not form data
  if (
    body !== undefined &&
    !requestHeaders.has("Content-Type") &&
    !isFormData
  ) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  // Attach Authorization token if available and not explicitly skipped
  if (!skipAuth && !requestHeaders.has("Authorization")) {
    const token = getStoredToken();
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  // Serialize object body to JSON
  const serializedBody =
    body !== undefined &&
    typeof body === "object" &&
    !isFormData &&
    !isBlob
      ? JSON.stringify(body)
      : body;

  let response;
  try {
    response = await fetch(url, {
      method: method.toUpperCase(),
      headers: requestHeaders,
      body: serializedBody,
      signal,
      ...customConfig,
    });
  } catch (networkError) {
    throw new ApiError(
      networkError.message || "Network request failed. Please verify your connection.",
      0
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return { success: true, data: null };
  }

  // Read response body safely (JSON vs text/HTML fallback)
  const contentType = response.headers.get("content-type") || "";
  let payload;

  if (contentType.includes("application/json")) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
  } else {
    try {
      const text = await response.text();
      payload = text ? { message: text.slice(0, 300) } : null;
    } catch {
      payload = null;
    }
  }

  // Handle 401 Unauthorized without creating hard redirect loops
  if (response.status === 401) {
    removeStoredToken();

    if (unauthorizedListener) {
      try {
        unauthorizedListener(response);
      } catch {
        // Prevent listener failures from suppressing error propagation
      }
    }
  }

  // Check for HTTP error status or backend { success: false }
  if (!response.ok || (payload && payload.success === false)) {
    const message =
      payload?.message ||
      (typeof payload === "string" ? payload : `Request failed with status ${response.status}`);
    const validationErrors = payload?.errors || null;
    const responseData = payload?.data ?? null;

    throw new ApiError(message, response.status, responseData, validationErrors);
  }

  return payload;
}

/**
 * Standard HTTP Method Helpers
 */
export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: "DELETE" }),
  request,
};

/**
 * Reusable Service Namespaces for Future Phases
 */

// Health & System
export const healthApi = {
  checkHealth: () => apiClient.get("/", { skipAuth: true }),
};

// Authentication (Login & Register)
export const authApi = {
  login: (credentials) => apiClient.post("/auth/login", credentials, { skipAuth: true }),
  register: (userData) => apiClient.post("/auth/register", userData, { skipAuth: true }),
};

// User Profile & Preferences
export const userApi = {
  getProfile: () => apiClient.get("/users/me"),
  updateProfile: (data) => apiClient.patch("/users/me", data),
};

// Cycles & Period Logs
export const cycleApi = {
  getCycles: (params) => apiClient.get("/cycles", { params }),
  createCycle: (data) => apiClient.post("/cycles", data),
  getCycleById: (cycleId) => apiClient.get(`/cycles/${cycleId}`),
  updateCycle: (cycleId, data) => apiClient.put(`/cycles/${cycleId}`, data),
  deleteCycle: (cycleId) => apiClient.delete(`/cycles/${cycleId}`),

  getPeriodLogs: (cycleId) => apiClient.get(`/cycles/${cycleId}/period-logs`),
  createPeriodLog: (cycleId, data) => apiClient.post(`/cycles/${cycleId}/period-logs`, data),
  getPeriodLogById: (cycleId, periodLogId) =>
    apiClient.get(`/cycles/${cycleId}/period-logs/${periodLogId}`),
  updatePeriodLog: (cycleId, periodLogId, data) =>
    apiClient.put(`/cycles/${cycleId}/period-logs/${periodLogId}`, data),
  deletePeriodLog: (cycleId, periodLogId) =>
    apiClient.delete(`/cycles/${cycleId}/period-logs/${periodLogId}`),
};

// Symptoms Catalog & Daily Logs
export const symptomApi = {
  getSymptoms: () => apiClient.get("/symptoms"),
  getLogs: (params) => apiClient.get("/symptoms/logs", { params }),
  createLog: (data) => apiClient.post("/symptoms/logs", data),
  getLogById: (id) => apiClient.get(`/symptoms/logs/${id}`),
  updateLog: (id, data) => apiClient.put(`/symptoms/logs/${id}`, data),
  deleteLog: (id) => apiClient.delete(`/symptoms/logs/${id}`),
};

// Reminders
export const reminderApi = {
  getReminders: (params) => apiClient.get("/reminders", { params }),
  createReminder: (data) => apiClient.post("/reminders", data),
  getReminderById: (id) => apiClient.get(`/reminders/${id}`),
  updateReminder: (id, data) => apiClient.put(`/reminders/${id}`, data),
  deleteReminder: (id) => apiClient.delete(`/reminders/${id}`),
};

// Analytics & Insights
export const insightsApi = {
  getInsights: (params) => apiClient.get("/insights", { params }),
};

export default apiClient;
