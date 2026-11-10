import { defineStore } from 'pinia'
import { ROLES, MODULES, COMPANIES, SAMPLE_USERS, buildDefaultPermissions } from '@/data/constants'

// ── Auth Store ─────────────────────────────────────────────
export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: { id: 1, name: 'Ahmad Fauzi', roleId: 1, companyId: 1, email: 'a.fauzi@majubersama.co.id' },
    activeCompanyId: 1,
  }),
  getters: {
    currentRole:  (s) => ROLES.find(r => r.id === s.currentUser.roleId),
    activeCompany:(s) => COMPANIES.find(c => c.id === s.activeCompanyId),
    isSuperAdmin: (s) => s.currentUser.roleId === 1,
  },
  actions: {
    setCompany(id) { this.activeCompanyId = id },
  }
})

// ── Permission Store ───────────────────────────────────────
export const usePermissionStore = defineStore('permission', {
  state: () => ({
    perms: { 1: buildDefaultPermissions(), 2: buildDefaultPermissions(), 3: buildDefaultPermissions() },
    hasChanges: false,
  }),
  getters: {
    getPerms: (s) => (companyId) => s.perms[companyId] ?? {},
  },
  actions: {
    toggle(companyId, moduleId, roleId, value) {
      if (!this.perms[companyId]) this.perms[companyId] = buildDefaultPermissions()
      this.perms[companyId][moduleId][roleId] = value
      this.hasChanges = true
    },
    save()              { this.hasChanges = false },
    reset(companyId)    { this.perms[companyId] = buildDefaultPermissions(); this.hasChanges = false },
  }
})

// ── Users Store ────────────────────────────────────────────
export const useUserStore = defineStore('users', {
  state: () => ({
    users:  JSON.parse(JSON.stringify(SAMPLE_USERS)),
    nextId: SAMPLE_USERS.length + 1,
  }),
  getters: {
    byCompany: (s) => (cId) => s.users.filter(u => u.companyId === cId),
  },
  actions: {
    add(user)       { this.users.push({ ...user, id: this.nextId++ }) },
    update(id, data){ const i = this.users.findIndex(u=>u.id===id); if(i!==-1) this.users[i]={...this.users[i],...data} },
    remove(id)      { this.users = this.users.filter(u=>u.id!==id) },
    toggleStatus(id){ const u=this.users.find(u=>u.id===id); if(u) u.status = u.status==='aktif'?'nonaktif':'aktif' },
  }
})

// ── Company Store ──────────────────────────────────────────
export const useCompanyStore = defineStore('company', {
  state: () => ({
    companies: JSON.parse(JSON.stringify(COMPANIES)),
    nextId:    COMPANIES.length + 1,
  }),
  actions: {
    add(c)       { this.companies.push({ ...c, id: this.nextId++ }) },
    update(id,d) { const i=this.companies.findIndex(c=>c.id===id); if(i!==-1) this.companies[i]={...this.companies[i],...d} },
    remove(id)   { this.companies=this.companies.filter(c=>c.id!==id) },
  }
})
