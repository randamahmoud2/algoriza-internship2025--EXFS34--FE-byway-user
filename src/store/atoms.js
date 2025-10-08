import { atom } from 'jotai'

// Simple localStorage utility for atoms
const atomWithStorage = (key, initialValue) => {
  const baseAtom = atom(
    typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue))
      : initialValue
  )
  
  return atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue = typeof update === 'function' ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(nextValue))
      }
    }
  )
}

// Auth atoms
export const authAtom = atomWithStorage('auth', {
  user: null,
  token: null,
  isAuthenticated: false
})

// Sync auth token with localStorage
export const syncAuthToken = (auth) => {
  if (auth.token) {
    localStorage.setItem('authToken', auth.token)
  } else {
    localStorage.removeItem('authToken')
  }
  
  // Also update the auth atom to ensure consistency
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth', JSON.stringify(auth))
  }
}

// Cart atoms
export const cartAtom = atomWithStorage('cart', [])

export const cartCountAtom = atom((get) => {
  const cart = get(cartAtom)
  return cart.length
})

export const cartTotalAtom = atom((get) => {
  const cart = get(cartAtom)
  return cart.reduce((total, item) => total + item.course.price, 0)
})

// Courses atoms
export const coursesAtom = atom([])
export const selectedCourseAtom = atom(null)

// Search and filter atoms
export const searchQueryAtom = atom('')
export const selectedCategoryAtom = atom('all')
export const selectedLevelAtom = atom('all')
export const sortByAtom = atom('newest')
export const currentPageAtom = atom(1)

// UI atoms
export const isLoadingAtom = atom(false)
export const errorAtom = atom(null)

// Modal atoms
export const isLoginModalOpenAtom = atom(false)
export const isRegisterModalOpenAtom = atom(false)

// Derived atoms for filtered courses
export const filteredCoursesAtom = atom((get) => {
  const courses = get(coursesAtom)
  const searchQuery = get(searchQueryAtom)
  const selectedCategory = get(selectedCategoryAtom)
  const selectedLevel = get(selectedLevelAtom)
  const sortBy = get(sortByAtom)

  let filtered = courses

  // Filter by search query
  if (searchQuery) {
    filtered = filtered.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Filter by category
  if (selectedCategory !== 'all') {
    filtered = filtered.filter(course => course.categoryId === selectedCategory)
  }

  // Filter by level
  if (selectedLevel !== 'all') {
    filtered = filtered.filter(course => course.level.toLowerCase() === selectedLevel.toLowerCase())
  }

  // Sort courses
  switch (sortBy) {
    case 'newest':
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'oldest':
      filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      break
    case 'price-low':
      filtered = filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      filtered = filtered.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      filtered = filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'popular':
      filtered = filtered.sort((a, b) => b.studentsCount - a.studentsCount)
      break
    default:
      break
  }

  return filtered
})

// Pagination atom
export const paginatedCoursesAtom = atom((get) => {
  const filtered = get(filteredCoursesAtom)
  const currentPage = get(currentPageAtom)
  const coursesPerPage = 9

  const startIndex = (currentPage - 1) * coursesPerPage
  const endIndex = startIndex + coursesPerPage

  return {
    courses: filtered.slice(startIndex, endIndex),
    totalPages: Math.ceil(filtered.length / coursesPerPage),
    totalCourses: filtered.length,
    currentPage
  }
})
