const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export type ApiResult<T> = {
  ok: boolean
  status: number
  data: T | { detail?: string } | string | null
  method: string
  endpoint: string
}

type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  token?: string
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  const method = options.method ?? 'GET'
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    credentials: 'include',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const contentType = response.headers.get('content-type') ?? ''
  let data: T | { detail?: string } | string | null = null

  if (contentType.includes('application/json')) {
    data = (await response.json()) as T
  } else {
    data = await response.text()
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
    method,
    endpoint,
  }
}

export type UserPayload = {
  name: string
  password: string
}

export type ItemPayload = {
  name: string
  user_id: number
}

export type PermissionPayload = {
  permission: number
  user_id: number
}

export type SqlLoginPayload = {
  login: string
  password: string
}

export type JwtTokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
}

export const api = {
  health: () => request<{ status: string }>('/health'),
  createUser: (payload: UserPayload) => request('/users/', { method: 'POST', body: payload }),
  getUser: (id: number) => request(`/users/${id}`),
  checkUsername: (name: string) => request(`/users/usernameConstraint?name=${encodeURIComponent(name)}`),
  login: (payload: UserPayload) => request('/users/login', { method: 'POST', body: payload }),
  createJwtToken: (payload: UserPayload) => request<JwtTokenResponse>('/users/token', { method: 'POST', body: payload }),
  getSensitiveUserStandard: (id: number) => request(`/users/sensitive-standard/${id}`),
  getSensitiveUserJwt: (token: string) => request('/users/sensitive-jwt', { token }),
  getSensitiveUserJwtById: (id: number, token: string) => request(`/users/sensitive-jwt/${id}`, { token }),
  createItem: (payload: ItemPayload) => request('/items/', { method: 'POST', body: payload }),
  getItem: (id: number) => request(`/items/${id}`),
  getItemOwnerStandard: (id: number) => request(`/items/owner-standard/${id}`),
  getItemOwnerJwt: (id: number, token: string) => request(`/items/owner-jwt/${id}`, { token }),
  createPermission: (payload: PermissionPayload) => request('/permissions/', { method: 'POST', body: payload }),
  getPermission: (id: number) => request(`/permissions/${id}`),
  sqliLoginSafe: (payload: SqlLoginPayload) => request('/sqli/login-safe', { method: 'POST', body: payload }),
  sqliReverseProxyCheck: (payload: SqlLoginPayload) => request('/sqli/login-reverse-proxy-check', { method: 'POST', body: payload }),
}

export { API_BASE_URL }
