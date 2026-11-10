/**
 * ============================================================
 *  API INDEX  —  export semua service dari satu titik
 *
 *  Cara pakai di component:
 *    import { UserService, CompanyService } from '@/api'
 *
 *  Untuk ganti URL backend, edit: src/api/config.js → BASE_URL
 *  atau set env variable: VITE_API_URL=https://api.domain.com/api
 * ============================================================
 */
export { default as AuthService }       from './auth.service'
export { default as UserService }       from './user.service'
export { default as CompanyService }    from './company.service'
export { default as PermissionService } from './permission.service'

export {
  SalesOrderService,
  SalesTargetService,
  CustomerService,
  SalesInvoiceService,
  SpvSalesService,
} from './sales.service'

export { api, BASE_URL } from './config'
