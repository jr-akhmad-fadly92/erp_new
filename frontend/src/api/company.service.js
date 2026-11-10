/**
 * ============================================================
 *  COMPANY SERVICE  —  CRUD Perusahaan
 * ============================================================
 *  Semua endpoint mengikuti RESTful convention.
 *  Backend cukup mengganti nama path-nya, payload tetap sama.
 *
 *  Base resource : /companies
 * ============================================================
 */
import { api } from './config'

const CompanyService = {
  /**
   * List semua perusahaan (dengan optional filter/search)
   * GET /companies?search=&status=&page=1&per_page=20
   * Response: { data: Company[], meta: { total, page, per_page } }
   */
  list(params = {}) {
    const q = new URLSearchParams(params).toString()
    return api.get(`/companies${q ? '?' + q : ''}`)
  },

  /**
   * Detail satu perusahaan
   * GET /companies/:id
   * Response: Company
   */
  get(id) {
    return api.get(`/companies/${id}`)
  },

  /**
   * Buat perusahaan baru
   * POST /companies
   * Body: { name, kota, bidang, status, color? }
   * Response: Company (created)
   */
  create(payload) {
    return api.post('/companies', payload)
  },

  /**
   * Update perusahaan
   * PUT /companies/:id
   * Body: { name?, kota?, bidang?, status?, color? }
   * Response: Company (updated)
   */
  update(id, payload) {
    return api.put(`/companies/${id}`, payload)
  },

  /**
   * Hapus perusahaan
   * DELETE /companies/:id
   * Response: { message: 'deleted' }
   */
  delete(id) {
    return api.delete(`/companies/${id}`)
  },

  /**
   * Statistik perusahaan (jumlah user per role, modul aktif)
   * GET /companies/:id/stats
   * Response: { user_count, module_count, users_by_role: [{role_id, count}] }
   */
  stats(id) {
    return api.get(`/companies/${id}/stats`)
  },
}

export default CompanyService
