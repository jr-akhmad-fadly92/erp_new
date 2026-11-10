/**
 * Generic CRUD API Service
 * 
 * This is a reusable service for all CRUD operations.
 * Backend only needs to provide the API endpoint name.
 * 
 * Usage:
 *   const crudApi = createCrudApi('spv-sales') // or 'users', 'products', etc.
 *   await crudApi.list()     // GET /api/spv-sales
 *   await crudApi.get(1)     // GET /api/spv-sales/1
 *   await crudApi.create(data)  // POST /api/spv-sales
 *   await crudApi.update(1, data) // PUT /api/spv-sales/1
 *   await crudApi.delete(1)   // DELETE /api/spv-sales/1
 */

const API_BASE = 'http://127.0.0.1:8001/api'

export function createCrudApi(endpoint) {
  return {
    /**
     * List all items
     * GET /api/{endpoint}
     */
    async list(params = {}) {
      try {
        const query = new URLSearchParams(params).toString()
        const url = query ? `${API_BASE}/${endpoint}?${query}` : `${API_BASE}/${endpoint}`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Role-Id': sessionStorage.getItem('roleId') || '1',
            'X-Company-Id': sessionStorage.getItem('companyId') || '1',
          }
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const result = await response.json()
        return result.data || result
      } catch (error) {
        console.error(`Failed to list ${endpoint}:`, error)
        throw error
      }
    },

    /**
     * Get single item
     * GET /api/{endpoint}/{id}
     */
    async get(id) {
      try {
        const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Role-Id': sessionStorage.getItem('roleId') || '1',
            'X-Company-Id': sessionStorage.getItem('companyId') || '1',
          }
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const result = await response.json()
        return result.data || result
      } catch (error) {
        console.error(`Failed to get ${endpoint}/${id}:`, error)
        throw error
      }
    },

    /**
     * Create new item
     * POST /api/{endpoint}
     */
    async create(data) {
      try {
        const response = await fetch(`${API_BASE}/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Role-Id': sessionStorage.getItem('roleId') || '1',
            'X-Company-Id': sessionStorage.getItem('companyId') || '1',
          },
          body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const result = await response.json()
        return result.data || result
      } catch (error) {
        console.error(`Failed to create ${endpoint}:`, error)
        throw error
      }
    },

    /**
     * Update item
     * PUT /api/{endpoint}/{id}
     */
    async update(id, data) {
      try {
        const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Role-Id': sessionStorage.getItem('roleId') || '1',
            'X-Company-Id': sessionStorage.getItem('companyId') || '1',
          },
          body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const result = await response.json()
        return result.data || result
      } catch (error) {
        console.error(`Failed to update ${endpoint}/${id}:`, error)
        throw error
      }
    },

    /**
     * Delete item
     * DELETE /api/{endpoint}/{id}
     */
    async delete(id) {
      try {
        const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Role-Id': sessionStorage.getItem('roleId') || '1',
            'X-Company-Id': sessionStorage.getItem('companyId') || '1',
          }
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const result = await response.json()
        return result.data || result || { success: true }
      } catch (error) {
        console.error(`Failed to delete ${endpoint}/${id}:`, error)
        throw error
      }
    }
  }
}
