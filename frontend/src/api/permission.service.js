/**
 * ============================================================
 *  PERMISSION SERVICE  —  Hak Akses Modul per Role
 * ============================================================
 *  Base resource : /permissions
 * ============================================================
 */
import { api } from './config'

const PermissionService = {
  /**
   * Ambil semua permission untuk satu perusahaan
   * GET /permissions?company_id=:id
   * Response:
   *   {
   *     data: [
   *       { module_id: 'm01', role_id: 1, allowed: true },
   *       ...
   *     ]
   *   }
   */
  getByCompany(companyId) {
    return api.get(`/permissions?company_id=${companyId}`)
  },

  /**
   * Simpan batch permission (bulk upsert)
   * POST /permissions/batch
   * Body:
   *   {
   *     company_id: 1,
   *     permissions: [
   *       { module_id: 'm03', role_id: 3, allowed: true },
   *       { module_id: 'm04', role_id: 3, allowed: false },
   *       ...
   *     ]
   *   }
   * Response: { message: 'saved', count: N }
   */
  saveBatch(companyId, permissions) {
    return api.post('/permissions/batch', { company_id: companyId, permissions })
  },

  /**
   * Reset ke default untuk satu perusahaan
   * DELETE /permissions/reset?company_id=:id
   * Response: { message: 'reset', count: N }
   */
  reset(companyId) {
    return api.delete(`/permissions/reset?company_id=${companyId}`)
  },

  /**
   * Ambil modul yang bisa diakses oleh satu user
   * GET /permissions/user/:userId
   * Response: { module_ids: ['m01','m03', ...] }
   */
  getByUser(userId) {
    return api.get(`/permissions/user/${userId}`)
  },
}

export default PermissionService
