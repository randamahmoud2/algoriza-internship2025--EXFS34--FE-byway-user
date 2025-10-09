import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Users, Clock, Play, ChevronLeft, ChevronRight, Plus, Quote, Loader2 } from 'lucide-react'
import { coursesAtom } from '../store/atoms'
import { courses, categories, instructors, platformStats } from '../data/mockData'
import useCounter from '../hooks/useCounter'
import { catalogApi } from '../utils/api'

const HomePage = () => {
  const [, setCourses] = useAtom(coursesAtom)

  // Counter animation only for 2400+ stat (3 seconds)
  const { count: count2400, elementRef: ref2400 } = useCounter(2400, 3000)

  // State for dynamic data
  const [dynamicCategories, setDynamicCategories] = useState([])
  const [dynamicCourses, setDynamicCourses] = useState([])
  const [dynamicInstructors, setDynamicInstructors] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [isLoadingInstructors, setIsLoadingInstructors] = useState(true)
  const [categoriesError, setCategoriesError] = useState(null)
  const [coursesError, setCoursesError] = useState(null)
  const [instructorsError, setInstructorsError] = useState(null)

  useEffect(() => {
    // Initialize courses data
    setCourses(courses)
  }, [setCourses])

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true)
        setCategoriesError(null)
        const response = await catalogApi.getCategories()
        setDynamicCategories(response)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategoriesError('Failed to load categories')
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch top courses from API
  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        setIsLoadingCourses(true)
        setCoursesError(null)
        const response = await catalogApi.getCourses({
          Page: 1,
          PageSize: 4,
          SortBy: 'rating',
          SortDirection: 'desc'
        })
        
        // Transform courses data to match expected format
        const transformedCourses = response.courses?.map(course => ({
          id: course.id.toString(),
          title: course.title,
          description: course.description,
          price: course.price,
          image: course.imageUrl ? `https://randaeldaba-001-site1.qtempurl.com${course.imageUrl}` : 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop',
          level: course.level,
          durationHours: course.durationHours,
          instructor: {
            name: course.instructorName
          },
          rating: course.rating,
          studentsCount: course.enrollmentCount,
          totalLectures: course.totalLectures,
          categoryName: course.categoryName
        })) || []
        
        setDynamicCourses(transformedCourses)
      } catch (error) {
        console.error('Error fetching courses:', error)
        setCoursesError('Failed to load courses')
      } finally {
        setIsLoadingCourses(false)
      }
    }

    fetchTopCourses()
  }, [])

  // Fetch top instructors from API
  useEffect(() => {
    const fetchTopInstructors = async () => {
      try {
        setIsLoadingInstructors(true)
        setInstructorsError(null)
        const response = await catalogApi.getTopInstructors(4)
        
        // Transform instructors data to match expected format
        const transformedInstructors = response.map(instructor => ({
          id: instructor.id.toString(),
          name: instructor.fullName,
          title: instructor.specialization || 'Instructor',
          rating: instructor.averageRating,
          studentsCount: instructor.totalEnrollments,
          avatar: instructor.profileImageUrl ? 
            `https://randaeldaba-001-site1.qtempurl.com${instructor.profileImageUrl}` : 
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        }))
        
        setDynamicInstructors(transformedInstructors)
      } catch (error) {
        console.error('Error fetching instructors:', error)
        setInstructorsError('Failed to load instructors')
      } finally {
        setIsLoadingInstructors(false)
      }
    }

    fetchTopInstructors()
  }, [])

  const featuredCourses = dynamicCourses.length > 0 ? dynamicCourses : courses.slice(0, 4)
  const topInstructors = dynamicInstructors.length > 0 ? dynamicInstructors : instructors.slice(0, 5)

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Unlock Your Potential with Byway
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Welcome to Byway, where learning empowers you to excel in your career. 
                  Join thousands of professionals who have transformed their lives through 
                  our expert-led courses and comprehensive learning paths.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/courses"
                  className="bg-blue-600 text-white inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start your Journey
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="Diverse group of learners"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 lg:space-x-16">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">250+</div>
              <div className="text-gray-600 font-medium">Courses by our best mentors</div>
            </div>
            <div className="hidden lg:block w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Courses by our best mentors</div>
            </div>
            <div className="hidden lg:block w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">15+</div>
              <div className="text-gray-600 font-medium">Courses by our best mentors</div>
            </div>
            <div className="hidden lg:block w-px h-12 bg-gray-300"></div>
            <div className="text-center" ref={ref2400}>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{count2400}+</div>
              <div className="text-gray-600 font-medium">Courses by our best mentors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Top Categories</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingCategories ? (
              // Loading state
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
                </div>
              ))
            ) : categoriesError ? (
              // Error state
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">{categoriesError}</p>
              </div>
            ) : dynamicCategories.length === 0 ? (
              // No categories available
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">No categories available</p>
              </div>
            ) : (
              // Dynamic categories
              dynamicCategories.slice(0, 4).map((category, index) => {
                const categoryIcons = ['🔭', '🖥️', '💻', '🎨']
                return (
                  <div key={category.id} className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">{categoryIcons[index] || '📚'}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.courseCount || 0} Courses</p>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Top Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Top Courses</h2>
            <div className="flex items-center space-x-4">
              <Link 
                to="/courses" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                See All
              </Link>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingCourses ? (
              // Loading state
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                </div>
              ))
            ) : coursesError ? (
              // Error state
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">{coursesError}</p>
              </div>
            ) : featuredCourses.length === 0 ? (
              // No courses found
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">No courses found</p>
              </div>
            ) : (
              // Dynamic courses
              featuredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
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
                        {course.categoryName || 'Course'}
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
                      {course.durationHours || 0} Total Hours. {course.totalLectures || 0} Lectures. {course.level || 'Beginner'}
                    </div>
                    
                    {/* Price - Large, bold */}
                    <div className="pt-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${course.price || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Top Instructors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Top Instructors</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {isLoadingInstructors ? (
              // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-200 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-3 w-16 mx-auto"></div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                      <div className="ml-1 h-3 bg-gray-200 rounded animate-pulse w-8"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20 mx-auto"></div>
                  </div>
                </div>
              ))
            ) : instructorsError ? (
              // Error state
              <div className="col-span-5 text-center py-8">
                <p className="text-gray-500">{instructorsError}</p>
              </div>
            ) : topInstructors.length === 0 ? (
              // No instructors found
              <div className="col-span-5 text-center py-8">
                <p className="text-gray-500">No instructors found</p>
              </div>
            ) : (
              // Dynamic instructors
              topInstructors.map((instructor) => (
                <div key={instructor.id} className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-20 h-20 rounded-lg mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-bold text-gray-900 mb-1">{instructor.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{instructor.title}</p>
                  
                  {/* Separator line */}
                  <div className="border-t border-gray-200 mb-4"></div>
                  
                  {/* Rating and Students - side by side */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-bold text-gray-900">{instructor.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-bold">{instructor.studentsCount || 0}</span> Students
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Customer Say About Us</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-blue-600 text-4xl mb-4">
                  <Quote className="w-8 h-8" />
                </div>
                <p className="text-gray-600 mb-6">
                  "Byway has transformed my career completely. The courses are well-structured, 
                  the instructors are knowledgeable, and the community is incredibly supportive. 
                  I highly recommend this platform to anyone looking to advance their skills."
                </p>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
                    alt="Jane Doe"
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Jane Doe</h4>
                    <p className="text-sm text-gray-500">Designer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become an Instructor Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=400&fit=crop"
                alt="Smiling instructor"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                BECOME AN INSTRUCTOR
          </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
            Instructors from around the world teach millions of students on Byway. 
            We provide the tools and skills to teach what you love.
          </p>
              <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
                Start Teaching on Byway
                <ArrowRight className="ml-2 w-5 h-5" />
          </button>
            </div>
          </div>
        </div>
      </section>

      {/* Transform Your Life Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Transform your life through education
          </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Learners around the world are expanding new careers, redesigning their lives, 
            and enriching their lives.
          </p>
              <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
                Choose Courses
                <Plus className="ml-2 w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=400&fit=crop"
                alt="Student with laptop"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
