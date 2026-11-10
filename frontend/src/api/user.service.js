/**
 * ============================================================
 *  USER SERVICE  —  CRUD Pengguna + Password
 * ============================================================
 *  Base resource : /users
 * ============================================================
 */
import { api } from './config'

const UserService = {
  /**
   * List pengguna (filter opsional)
   * GET /users?company_id=&role_id=&status=&search=&page=1&per_page=20
   * Response: { data: User[], meta: { total, page, per_page } }
   */
  list(params = {}) {
    const q = new URLSearchParams(params).toString()
    return api.get(`/users${q ? '?' + q : ''}`)
  },

  /**
   * Detail satu pengguna
   * GET /users/:id
   * Response: User
   */
  get(id) {
    return api.get(`/users/${id}`)
  },

  /**
   * Buat pengguna baru (dengan password awal)
   * POST /users
   * Body:
   *   {
   *     name, email, password, password_confirmation,
   *     role_id, company_id, status
   *   }
   * Response: User (created)
   */
  create(payload) {
    return api.post('/users', payload)
  },

  /**
   * Update data pengguna (tanpa password)
   * PUT /users/:id
   * Body: { name?, email?, role_id?, company_id?, status? }
   * Response: User (updated)
   */
  update(id, payload) {
    return api.put(`/users/${id}`, payload)
  },

  /**
   * Reset / ubah password pengguna oleh Admin
   * PUT /users/:id/password
   * Body:
   *   {
   *     new_password,
   *     new_password_confirmation
   *   }
   * Response: { message: 'password updated' }
   */
  resetPassword(id, payload) {
    return api.put(`/users/${id}/password`, payload)
  },

  /**
   * Toggle status aktif / nonaktif
   * PATCH /users/:id/status
   * Body: { status: 'aktif' | 'nonaktif' }
   * Response: User (updated)
   */
  toggleStatus(id, status) {
    return api.patch(`/users/${id}/status`, { status })
  },

  /**
   * Hapus pengguna
   * DELETE /users/:id
   * Response: { message: 'deleted' }
   */
  delete(id) {
    return api.delete(`/users/${id}`)
  },
}

export default UserService
