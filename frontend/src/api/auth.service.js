/**
 * ============================================================
 *  AUTH SERVICE
 *  Endpoint login, logout, refresh token, get profile
 * ============================================================
 */
import { api } from './config'

const AuthService = {
  /**
   * Login
   * POST /auth/login
   * Body : { email, password }
   * Response: { token, user: { id, name, email, roleId, companyId, status } }
   */
  login(email, password) {
    return api.post('/auth/login', { email, password })
  },

  /**
   * Logout
   * POST /auth/logout
   * Header: Authorization: Bearer {token}
   */
  logout() {
    return api.post('/auth/logout')
  },

  /**
   * Refresh token
   * POST /auth/refresh
   * Response: { token }
   */
  refresh() {
    return api.post('/auth/refresh')
  },

  /**
   * Get profil pengguna yang sedang login
   * GET /auth/me
   * Response: { id, name, email, roleId, companyId, status }
   */
  me() {
    return api.get('/auth/me')
  },

  /**
   * Ubah password sendiri
   * PUT /auth/password
   * Body: { current_password, new_password, new_password_confirmation }
   */
  changePassword(payload) {
    return api.put('/auth/password', payload)
  },
}

export default AuthService
