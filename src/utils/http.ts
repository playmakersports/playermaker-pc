/**
 * HTTP Error class for handling API errors
 */
export class HttpError extends Error {
  public readonly name = 'HttpError';

  constructor(
    public readonly status: number,
    public readonly data?: any,
  ) {
    super(data?.message);
  }
}

/**
 * Type guard to check if an error is an HttpError
 */
export function isHttpError(e: unknown): e is HttpError {
  return typeof e === 'object' && e != null && (e as any)?.name === 'HttpError';
}

/**
 * HTTP request options interface
 */
export interface HttpRequestOptions {
  headers?: Record<string, string | null | undefined>;
  searchParams?: Record<string, string | number | boolean | string[] | null | undefined>;
  json?: Record<string, unknown> | unknown[];
}

/**
 * HTTP request methods
 */
export type HttpRequestMethod = 'get' | 'post' | 'patch' | 'put' | 'delete';

/**
 * HTTP client class for making API requests
 */
class Http {
  private readonly baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  }
  async get<T>(path: string, options?: Omit<HttpRequestOptions, 'json'>): Promise<T> {
    return await this.request('get', path, options);
  }

  async post<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return await this.request('post', path, options);
  }

  async patch<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return await this.request('patch', path, options);
  }

  async put<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return await this.request('put', path, options);
  }

  async delete<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return await this.request('delete', path, options);
  }

  private async request<T>(method: HttpRequestMethod, path: string, options?: HttpRequestOptions): Promise<T> {
    const { url, headers, body } = this.parseRequestOptions(method, path, options);

    const resp = await fetch(url.toString(), { method, headers, body });

    if (resp.ok) {
      return await resp.json();
    }

    const errorData = await resp.json().catch(() => null);
    throw new HttpError(resp.status, errorData);
  }

  private parseRequestOptions(method: HttpRequestMethod, path: string, options: HttpRequestOptions = {}) {
    const url = new URL(path, this.baseURL);

    // Add search parameters
    for (const [key, value] of Object.entries(options.searchParams ?? {})) {
      if (value == null) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const val of value) {
          url.searchParams.append(key, val);
        }
      } else {
        url.searchParams.set(key, String(value));
      }
    }

    // Prepare request body
    const body = method !== 'get' && options?.json != null ? JSON.stringify(options.json) : null;

    // Prepare headers
    const headers = new Headers();
    for (const [key, value] of Object.entries(options?.headers ?? {})) {
      if (value != null) {
        headers.set(key, value);
      }
    }

    if (body != null) {
      headers.set('content-type', 'application/json');
    }

    return { url, body, headers };
  }
}

/**
 * Singleton HTTP client instance
 */
export const http = new Http();
