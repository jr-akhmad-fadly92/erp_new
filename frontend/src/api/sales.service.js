/**
 * ============================================================
 *  SALES SERVICE  —  SPV Sales + Sales Order + Target + Laporan
 * ============================================================
 *  Base resources:
 *    /sales-orders
 *    /sales-targets
 *    /customers
 *    /sales-invoices
 *    /spv-sales
 * ============================================================
 */
import { api } from './config'

// ── Sales Order ─────────────────────────────────────────────
export const SalesOrderService = {
  /** GET /sales-orders?company_id=&status=&search=&page=&per_page= */
  list: (p = {}) => api.get(`/sales-orders?${new URLSearchParams(p)}`),
  /** GET /sales-orders/:id */
  get: (id) => api.get(`/sales-orders/${id}`),
  /**
   * POST /sales-orders
   * Body: { company_id, customer_id, date, items:[{product_id,qty,price}], notes }
   */
  create: (payload) => api.post('/sales-orders', payload),
  /** PUT /sales-orders/:id */
  update: (id, payload) => api.put(`/sales-orders/${id}`, payload),
  /** PATCH /sales-orders/:id/status  Body: { status } */
  updateStatus: (id, status) => api.patch(`/sales-orders/${id}/status`, { status }),
  /** DELETE /sales-orders/:id */
  delete: (id) => api.delete(`/sales-orders/${id}`),
}

// ── Target Sales ─────────────────────────────────────────────
export const SalesTargetService = {
  /** GET /sales-targets?company_id=&year=&month=&role_id= */
  list: (p = {}) => api.get(`/sales-targets?${new URLSearchParams(p)}`),
  /** GET /sales-targets/:id */
  get: (id) => api.get(`/sales-targets/${id}`),
  /**
   * POST /sales-targets
   * Body: { company_id, user_id, role_id, year, month, target_amount }
   */
  create: (payload) => api.post('/sales-targets', payload),
  /** PUT /sales-targets/:id */
  update: (id, payload) => api.put(`/sales-targets/${id}`, payload),
  /** DELETE /sales-targets/:id */
  delete: (id) => api.delete(`/sales-targets/${id}`),
  /**
   * GET /sales-targets/achievement?company_id=&year=&month=
   * Response: [{ user_id, name, target, actual, pct }]
   */
  achievement: (p = {}) => api.get(`/sales-targets/achievement?${new URLSearchParams(p)}`),
}

// ── Customer (Pelanggan) ─────────────────────────────────────
export const CustomerService = {
  /** GET /customers?company_id=&search=&page=&per_page= */
  list: (p = {}) => api.get(`/customers?${new URLSearchParams(p)}`),
  get: (id) => api.get(`/customers/${id}`),
  /**
   * POST /customers
   * Body: { company_id, name, phone, email, address, npwp, credit_limit }
   */
  create: (payload) => api.post('/customers', payload),
  update: (id, payload) => api.put(`/customers/${id}`, payload),
  delete: (id) => api.delete(`/customers/${id}`),
}

// ── Invoice Penjualan ────────────────────────────────────────
export const SalesInvoiceService = {
  /** GET /sales-invoices?company_id=&status=&from=&to=&page=&per_page= */
  list: (p = {}) => api.get(`/sales-invoices?${new URLSearchParams(p)}`),
  get: (id) => api.get(`/sales-invoices/${id}`),
  /**
   * POST /sales-invoices
   * Body: { company_id, sales_order_id, due_date, discount, tax_pct, notes }
   */
  create: (payload) => api.post('/sales-invoices', payload),
  update: (id, payload) => api.put(`/sales-invoices/${id}`, payload),
  /** PATCH /sales-invoices/:id/status  Body: { status: 'paid'|'partial'|'overdue' } */
  updateStatus: (id, status) => api.patch(`/sales-invoices/${id}/status`, { status }),
  delete: (id) => api.delete(`/sales-invoices/${id}`),
}

// ── SPV Sales (Supervisor) ────────────────────────────────────
export const SpvSalesService = {
  /**
   * Dashboard SPV: ringkasan tim sales di bawah supervisi
   * GET /spv-sales/dashboard?company_id=&month=&year=
   * Response: { team_sales, total_order, total_revenue, achievement_pct, members:[] }
   */
  dashboard: (p = {}) => api.get(`/spv-sales/dashboard?${new URLSearchParams(p)}`),

  /**
   * Daftar anggota tim sales yang disupervisi
   * GET /spv-sales/team?company_id=
   * Response: [{ user_id, name, role, total_order, total_revenue, target, pct }]
   */
  team: (p = {}) => api.get(`/spv-sales/team?${new URLSearchParams(p)}`),

  /**
   * Laporan performa per sales
   * GET /spv-sales/performance?company_id=&user_id=&from=&to=
   */
  performance: (p = {}) => api.get(`/spv-sales/performance?${new URLSearchParams(p)}`),

  /**
   * Approve / reject sales order oleh SPV
   * PATCH /spv-sales/orders/:id/approve
   * Body: { action: 'approve'|'reject', notes }
   */
  approveOrder: (orderId, action, notes = '') =>
    api.patch(`/spv-sales/orders/${orderId}/approve`, { action, notes }),

  /**
   * Set target untuk anggota tim
   * POST /spv-sales/targets
   * Body: { user_id, year, month, target_amount, company_id }
   */
  setTarget: (payload) => api.post('/spv-sales/targets', payload),
}
