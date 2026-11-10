/**
 * ============================================================
 *  API CONFIG
 *  Ganti BASE_URL dengan URL backend Anda.
 *  Semua endpoint, method, dan payload sudah didefinisikan
 *  di masing-masing file service — backend cukup menyesuaikan
 *  nama route-nya.
 * ============================================================
 */

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const TIMEOUT = 15000 // ms

/**
 * Buat headers default.
 * Token diambil dari localStorage (disesuaikan dengan auth backend Anda).
 */
function getHeaders(extra = {}) {
  const token = localStorage.getItem('auth_token')
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

/**
 * Wrapper fetch utama.
 * Mengembalikan { data, error, status }.
 */
export async function request(method, endpoint, body = null) {
  const url = `${BASE_URL}${endpoint}`
  const options = {
    method: method.toUpperCase(),
    headers: getHeaders(),
    signal: AbortSignal.timeout(TIMEOUT),
  }
  if (body && !['GET', 'DELETE'].includes(options.method)) {
    options.body = JSON.stringify(body)
  }

  try {
    const res = await fetch(url, options)
    const json = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        data: null,
        error: json?.message || json?.error || `HTTP ${res.status}`,
        status: res.status,
      }
    }
    return { data: json, error: null, status: res.status }
  } catch (err) {
    if (err.name === 'TimeoutError') return { data: null, error: 'Request timeout', status: 0 }
    return { data: null, error: err.message || 'Network error', status: 0 }
  }
}

export const api = {
  get:    (url)         => request('GET',    url),
  post:   (url, body)   => request('POST',   url, body),
  put:    (url, body)   => request('PUT',    url, body),
  patch:  (url, body)   => request('PATCH',  url, body),
  delete: (url)         => request('DELETE', url),
}
