import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, Search, Star, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { 
  coursesAtom, 
  searchQueryAtom, 
  selectedCategoryAtom, 
  selectedLevelAtom, 
  sortByAtom, 
  currentPageAtom,
  paginatedCoursesAtom 
} from '../store/atoms'
import { catalogApi, adminApi } from '../utils/api'

const CoursesPage = () => {
  const [, setCourses] = useAtom(coursesAtom)
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom)
  const [selectedLevel, setSelectedLevel] = useAtom(selectedLevelAtom)
  const [sortBy, setSortBy] = useAtom(sortByAtom)
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom)
  const [paginatedData] = useAtom(paginatedCoursesAtom)
  
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetchTime, setLastFetchTime] = useState(Date.now())

  // Auto-refresh every 30 seconds to get new courses from admin
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      // Only refresh if it's been more than 30 seconds since last fetch
      if (now - lastFetchTime > 30000) {
        fetchData()
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [lastFetchTime])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch courses and categories in parallel
        const [coursesResponse, categoriesResponse] = await Promise.all([
          catalogApi.getCourses({
            Page: 1,
            PageSize: 100, // Get all courses for client-side filtering
            SearchTerm: searchQuery || undefined,
            Level: selectedLevel !== 'all' ? selectedLevel : undefined
          }),
          catalogApi.getCategories()
        ])
        
        console.log('Courses API Response:', coursesResponse) // Debug log
        console.log('Categories API Response:', categoriesResponse) // Debug log
        console.log('Number of courses received:', coursesResponse.courses?.length || 0) // Debug log
        
        // Transform courses data to match expected format
        const transformedCourses = coursesResponse.courses?.map(course => ({
          id: course.id.toString(),
          title: course.title,
          description: course.description,
          shortDescription: course.description?.substring(0, 100) + '...',
          price: course.price,
          image: course.imageUrl ? `http://localhost:5005${course.imageUrl}` : 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop',
          video: course.videoUrl || '',
          level: course.level,
          duration: course.durationHours,
          lectures: course.totalLectures || 0,
          category: course.categoryName,
          categoryId: course.categoryId.toString(),
          instructor: {
            id: course.instructorId.toString(),
            name: course.instructorName
          },
          rating: course.rating,
          studentsCount: course.enrollmentCount,
          tags: [course.categoryName],
          createdAt: new Date(course.createdAt),
          updatedAt: new Date(course.updatedAt)
        })) || []
        
        console.log('Transformed Courses:', transformedCourses) // Debug log
        console.log('Number of courses:', transformedCourses.length) // Debug log
        
        // Transform categories data
        const transformedCategories = categoriesResponse.map(category => ({
          id: category.id.toString(),
          name: category.name,
          icon: '💻', // Default icon
          coursesCount: transformedCourses.filter(course => course.categoryId === category.id.toString()).length
        }))
        
        setCourses(transformedCourses)
        setCategories(transformedCategories)
        setLastFetchTime(Date.now()) // Update last fetch time
        
        // Handle URL search params
        const category = searchParams.get('category')
        const level = searchParams.get('level')
        const search = searchParams.get('search')
        const sort = searchParams.get('sort')
        const page = searchParams.get('page')

        if (category) setSelectedCategory(category)
        if (level) setSelectedLevel(level)
        if (search) setSearchQuery(search)
        if (sort) setSortBy(sort)
        if (page) setCurrentPage(parseInt(page))
        
      } catch (err) {
        console.error('Error fetching data:', err)
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        })
        setError(`Failed to load courses: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [setCourses, setSelectedCategory, setSelectedLevel, setSearchQuery, setSortBy, setCurrentPage, searchParams])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    if (selectedLevel !== 'all') params.set('level', selectedLevel)
    if (searchQuery) params.set('search', searchQuery)
    if (sortBy !== 'newest') params.set('sort', sortBy)
    if (currentPage !== 1) params.set('page', currentPage.toString())
    
    setSearchParams(params)
  }, [selectedCategory, selectedLevel, searchQuery, sortBy, currentPage, setSearchParams])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  const handleLevelFilter = (level) => {
    setSelectedLevel(level)
    setCurrentPage(1)
  }

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedLevel('all')
    setSearchQuery('')
    setSortBy('newest')
    setCurrentPage(1)
  }

  const renderPagination = () => {
    const { totalPages } = paginatedData
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 rounded-lg ${
              currentPage === page
                ? 'bg-primary-600 text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Courses</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto container-padding py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Courses</h1>
          <p className="text-gray-600">All Development Courses</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden w-full btn-outline mb-4 flex items-center justify-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>

            <div className={`space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
              {/* Sort */}
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="newest">The latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Number of Lectures */}
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Number of Lectures</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">1-15</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">16-30</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">31-45</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">46+</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Price</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-20 p-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-20 p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'all'}
                      onChange={() => handleCategoryFilter('all')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">All Categories</span>
                  </label>
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => handleCategoryFilter(category.id)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Level</h3>
                <div className="space-y-2">
                  {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="level"
                        checked={selectedLevel === level}
                        onChange={() => handleLevelFilter(level)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600 capitalize">
                        {level === 'all' ? 'All Levels' : level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full btn-outline"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {paginatedData.courses.length} of {paginatedData.totalCourses} results
              </p>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedData.courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop'
                      }}
                    />
                    {/* Category tag overlay */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-purple-200 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                        {course.category || 'Course'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    {/* Course Name - Large, bold */}
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                      {course.title}
                    </h3>
                    
                    {/* Author - Smaller, regular */}
                    <div className="text-sm text-gray-700">
                      By {course.instructor?.name || 'Unknown Instructor'}
                    </div>
                    
                    {/* Rating - 5 stars */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(course.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    
                    {/* Course Details - Hours, Lectures, Level */}
                    <div className="text-sm text-gray-700">
                      {course.duration || 0} Total Hours. {course.lectures || 0} Lectures. {course.level || 'Beginner'}
                    </div>
                    
                    {/* Price - Large, bold */}
                    <div className="pt-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${course.price || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* No Results */}
            {paginatedData.courses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursesPage
