const API_BASE = import.meta.env.VITE_API_BASE || 'https://randaeldaba-001-site1.qtempurl.com/api';

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token)
  } else {
    localStorage.removeItem('authToken')
  }
}

const getHeaders = (isJson = true) => {
  const token = localStorage.getItem('authToken')
  const headers = {}
  if (isJson) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export const authApi = {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/Auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      if (res.status === 401) {
        throw new Error('Invalid email or password')
      }
      throw new Error(errorData.message || 'Login failed')
    }
    return res.json()
  },
  async register(email, password) {
    const res = await fetch(`${API_BASE}/Auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email: email, password: password })
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || 'Registration failed')
    }
    return res.json()
  }
}

export const catalogApi = {
  async getCourses(params = {}) {
    const url = new URL(`${API_BASE}/user/catalog/courses`)
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
    })
    const res = await fetch(url, { headers: getHeaders(false) })
    if (!res.ok) throw new Error('Failed to load courses')
    return res.json()
  },
  async getCourse(id) {
    const res = await fetch(`${API_BASE}/Courses/${id}`, { headers: getHeaders(false) })
    if (!res.ok) throw new Error('Course not found')
    return res.json()
  },
  async getCategories() {
    const res = await fetch(`${API_BASE}/user/catalog/categories`, { headers: getHeaders(false) })
    if (!res.ok) throw new Error('Failed to load categories')
    return res.json()
  },
  async getTopInstructors(count = 4) {
    const res = await fetch(`${API_BASE}/Dashboard/top-instructors?count=${count}`, { headers: getHeaders(false) })
    if (!res.ok) throw new Error('Failed to load instructors')
    return res.json()
  }
}

export const adminApi = {
  async getCourses(params = {}) {
    const url = new URL(`${API_BASE}/Courses`)
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
    })
    const res = await fetch(url, { headers: getHeaders(false) })
    if (!res.ok) throw new Error('Failed to load courses')
    return res.json()
  },
  async getCourse(id) {
    const res = await fetch(`${API_BASE}/Courses/${id}`, { headers: getHeaders(false) })
    if (!res.ok) throw new Error('Course not found')
    return res.json()
  },
  async getCategories() {
    const res = await fetch(`${API_BASE}/Categories`, { headers: getHeaders(false) })
    if (!res.ok) throw new Error('Failed to load categories')
    return res.json()
  }
}

export const enrollmentApi = {
  async listMyEnrollments() {
    const res = await fetch(`${API_BASE}/user/enrollments`, { headers: getHeaders(false) })
    if (!res.ok) throw new Error('Failed to load enrollments')
    return res.json()
  },
  async checkout(courseIds) {
    const res = await fetch(`${API_BASE}/user/enrollments/checkout`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ courseIds })
    })
    if (!res.ok) throw new Error('Checkout failed')
    return res.json()
  }
}



