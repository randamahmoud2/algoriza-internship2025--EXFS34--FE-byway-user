import { useAtom } from 'jotai'
import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Star, Clock, Users, Play, BookOpen, Award, Globe, Share2, Heart, Loader2 } from 'lucide-react'
import { authAtom, cartAtom, coursesAtom } from '../store/atoms'
import { catalogApi } from '../utils/api'

const CourseDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [auth] = useAtom(authAtom)
  const [cart, setCart] = useAtom(cartAtom)
  const [allCourses] = useAtom(coursesAtom)
  
  const [course, setCourse] = useState(null)
  const [instructor, setInstructor] = useState(null)
  const [courseContents, setCourseContents] = useState([])
  const [relatedCourses, setRelatedCourses] = useState([])
  const [isInCart, setIsInCart] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Refs for scrolling to sections
  const descriptionRef = useRef(null)
  const instructorRef = useRef(null)
  const contentRef = useRef(null)
  const reviewsRef = useRef(null)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch course details
        const courseData = await catalogApi.getCourse(id)
        
        // Fetch instructor details
        let instructorData = null
        try {
          instructorData = await fetch(`http://localhost:5005/api/user/catalog/instructors/${courseData.instructorId}`, {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => res.json())
        } catch (instructorErr) {
          console.warn('Could not fetch instructor details:', instructorErr)
        }
        let contentsData = []
        try {
          contentsData = await fetch(`http://localhost:5005/api/user/catalog/courses/${courseData.id}/contents`, {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => res.json())
        } catch (contentsErr) {
          console.warn('Could not fetch course contents:', contentsErr)
        }
        const transformedCourse = {
          id: courseData.id.toString(),
          title: courseData.title,
          description: courseData.description,
          shortDescription: courseData.description?.substring(0, 100) + '...',
          price: courseData.price,
          image: courseData.imageUrl ? `http://localhost:5005${courseData.imageUrl}` : 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop',
          video: courseData.videoUrl || '',
          level: courseData.level,
          duration: courseData.durationHours,
          lectures: courseData.totalLectures || 0,
          category: courseData.categoryName,
          categoryId: courseData.categoryId.toString(),
          instructor: {
            id: courseData.instructorId.toString(),
            name: courseData.instructorName
          },
          rating: courseData.rating,
          studentsCount: courseData.enrollmentCount,
          tags: [courseData.categoryName],
          createdAt: new Date(courseData.createdAt),
          updatedAt: new Date(courseData.updatedAt),
          certification: courseData.certification
        }
        
        setCourse(transformedCourse)
        setInstructor(instructorData)
        setCourseContents(contentsData)
        
      // Find related courses from the same category
        const related = allCourses
          .filter(c => c.categoryId === transformedCourse.categoryId && c.id !== transformedCourse.id)
        .slice(0, 4)
      setRelatedCourses(related)
        
      } catch (err) {
        console.error('Error fetching course:', err)
        setError('Failed to load course details. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (id) {
      fetchCourseData()
    }
  }, [id, allCourses])

  useEffect(() => {
    // Check if course is already in cart
    if (course) {
      setIsInCart(cart.some(item => item.courseId === course.id))
    }
  }, [cart, course])

  const handleAddToCart = () => {
    if (!auth.isAuthenticated) {
      alert('Please log in to add courses to your cart')
      return
    }

    if (!isInCart && course) {
      const cartItem = {
        courseId: course.id,
        course: course,
        addedAt: new Date()
      }
      setCart(prev => [...prev, cartItem])
      
    }
  }

  const handleBuyNow = () => {
    if (!auth.isAuthenticated) {
      alert('Please log in to purchase courses')
      return
    }
    
    // Add to cart if not already there
    if (!isInCart && course) {
      handleAddToCart()
    }
    
    // Navigate to checkout page
    navigate('/checkout')
  }

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId)
    const refs = {
      description: descriptionRef,
      instructor: instructorRef,
      content: contentRef,
      reviews: reviewsRef
    }
    
    const ref = refs[sectionId]
    if (ref && ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Course</h3>
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

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Course Not Found</h3>
          <p className="text-gray-500 mb-4">The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">></span>
            <Link to="/courses" className="hover:text-blue-600">Courses</Link>
            <span className="mx-2">></span>
            <span className="text-gray-900">{course.title}</span>
          </nav>
                </div>
              </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Details */}
          <div className="lg:col-span-2">
            {/* Course Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>
            
            {/* Course Overview */}
            <p className="text-gray-600 mb-4 leading-relaxed">
              {course.description}
            </p>
            
            {/* Course Stats */}
            <p className="text-sm text-gray-500 mb-6">
              {course.duration || 0} Total Hours, {course.lectures || 0} Lectures, {course.level || 'Beginner'}
            </p>
            
            {/* Instructor Info */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {course.instructor?.name?.charAt(0) || 'I'}
                </span>
                  </div>
              <div>
                <p className="text-sm text-gray-600">Created by <span className="font-medium">{course.instructor?.name || 'Unknown Instructor'}</span></p>
                <p className="text-xs text-gray-500">{course.category || 'Course'}</p>
        </div>
      </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'instructor', label: 'Instructor' },
                  { id: 'content', label: 'Content' },
                  { id: 'reviews', label: 'Reviews' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* All Sections - Single Page Layout */}
            <div className="space-y-16">
              
              {/* Description Section */}
              <div ref={descriptionRef} className="scroll-mt-20">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Description</h3>
                <div className="space-y-6">
                  <div>
                      <p className="text-gray-600 leading-relaxed">
                      {course.description || 'This interactive e-learning course will introduce you to User Experience (UX) design, a crucial field that focuses on creating meaningful and enjoyable experiences for users when they interact with products, services, or systems. You\'ll learn the fundamental principles, methodologies, and tools used by professional UX designers to research, design, and test user-centered solutions.'}
                      </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Certification</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {course.certification || 'Upon successful completion of this course, you will receive a certificate of completion that you can add to your professional portfolio. This certificate demonstrates your understanding of UX design principles and your ability to apply them in real-world scenarios.'}
                    </p>
                        </div>
                    </div>
                  </div>

              {/* Instructor Section */}
              <div ref={instructorRef} className="scroll-mt-20">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Instructor</h3>
                  <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                    {instructor?.profileImageUrl ? (
                      <img 
                        src={`http://localhost:5005${instructor.profileImageUrl}`} 
                        alt={instructor.fullName}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-medium text-gray-600">
                        {course.instructor?.name?.charAt(0) || 'I'}
                      </span>
                    )}
                  </div>
                    <div className="flex-1">
                    <h4 className="text-lg font-bold text-blue-600 mb-1">
                      {instructor?.fullName || course.instructor?.name || 'Unknown Instructor'}
                      </h4>
                    <p className="text-sm text-gray-600 mb-4">{instructor?.specialization || course.category || 'Instructor'}</p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">40,445</div>
                        <div className="text-xs text-gray-500">Reviews</div>
                        </div>
                        <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {instructor ? instructor.totalStudents : (course.studentsCount || 800)}
                          </div>
                        <div className="text-xs text-gray-500">Students</div>
                        </div>
                        <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {instructor ? instructor.courseCount : 15}
                          </div>
                        <div className="text-xs text-gray-500">Courses</div>
                        </div>
                      </div>
                      
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {instructor?.bio || instructor?.experience || 'Ronald Richards is a seasoned UX/UI designer with over 10 years of experience in creating user-centered digital experiences. He has worked with leading tech companies and startups, helping them design products that users love. His expertise spans across user research, information architecture, interaction design, and usability testing.'}
                      </p>
                    </div>
                  </div>
                </div>

              {/* Content Section */}
              <div ref={contentRef} className="scroll-mt-20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Content</h3>
                  <div className="text-sm text-gray-500">
                    {course.duration || 0} Total Hours • {course.lectures || 0} Lectures
                  </div>
                </div>
                <div className="space-y-4">
                  {courseContents && courseContents.length > 0 ? (
                    courseContents.map((content, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-dotted border-gray-300">
                        <h4 className="font-medium text-gray-900">{content.name}</h4>
                      </div>
                    ))
                  ) : (
                    // Fallback content if no API data
                    [
                      { title: 'Introduction to UX Design', lectures: 9, hours: 1 },
                      { title: 'Basics of User-Centered Design', lectures: 9, hours: 1 },
                      { title: 'Elements of User Experience', lectures: 9, hours: 1 },
                      { title: 'Visual Design Principles', lectures: 9, hours: 1 }
                    ].map((section, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-dotted border-gray-300">
                        <h4 className="font-medium text-gray-900">{section.title}</h4>
                        <div className="text-sm text-gray-500">
                          {section.lectures} Lectures, {section.hours} Hour
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              <div ref={reviewsRef} className="scroll-mt-20">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Learner Reviews</h3>
                
                {/* Overall Rating */}
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-2xl font-bold text-gray-900">4.8</span>
                  <span className="text-sm text-gray-500">40,445 Reviews</span>
                </div>
                
                {/* Rating Breakdown */}
                <div className="space-y-2 mb-8">
                  {[
                    { stars: 5, percentage: 80 },
                    { stars: 4, percentage: 15 },
                    { stars: 3, percentage: 4 },
                    { stars: 2, percentage: 1 },
                    { stars: 1, percentage: 0 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 w-8">{item.stars} star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-8">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
                
                {/* Individual Reviews */}
                  <div className="space-y-6">
                    {[
                      {
                      name: 'Mark Doe',
                      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
                        rating: 5,
                      date: '22 February, 2024',
                      comment: 'This course exceeded my expectations! The instructor explains complex UX concepts in a way that\'s easy to understand. The practical projects really helped me apply what I learned. Highly recommend for anyone looking to break into UX design.'
                      },
                      {
                      name: 'Mark Doe',
                      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
                        rating: 5,
                      date: '22 February, 2024',
                      comment: 'Excellent course! The content is well-structured and the instructor is very knowledgeable. I learned so much about user research and design thinking. The real-world examples made everything click for me.'
                    },
                    {
                      name: 'Mark Doe',
                      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
                      rating: 5,
                      date: '22 February, 2024',
                      comment: 'Amazing course! The step-by-step approach made learning UX design so much easier. The instructor\'s experience really shows through the quality of the content. I feel confident to start my UX design journey now.'
                      }
                    ].map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start space-x-4">
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{review.name}</h4>
                            <span className="text-sm text-gray-500">Reviewed on {review.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                
                {/* View More Reviews Button */}
                <div className="mt-8">
                  <button className="px-6 py-2 border border-gray-300 rounded-lg text-blue-600 hover:bg-gray-50 transition-colors">
                    View more reviews
                  </button>
                  </div>
                </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
              {/* Course Image */}
              <div className="mb-6">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop'
                  }}
                />
              </div>
              
              {/* Price */}
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">${course.price || 0}</span>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isInCart
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isInCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Buy Now
                </button>
              </div>
              
              {/* Share Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Share</h3>
                <div className="flex space-x-3">
                  {[
                    { name: 'Facebook', icon: '📘' },
                    { name: 'GitHub', icon: '🐙' },
                    { name: 'Google', icon: '🔍' },
                    { name: 'X', icon: '🐦' },
                    { name: 'Microsoft', icon: '🔷' }
                  ].map((social, index) => (
                    <button
                      key={index}
                      className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                      title={social.name}
                    >
                      <span className="text-lg">{social.icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Courses Like This */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">More Courses Like This</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                title: "Beginner's Guide to Design",
                instructor: "Ronald Richards",
                rating: 5,
                hours: 22,
                lectures: 150,
                level: "Beginner",
                price: 45,
                image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop",
                category: "UX/UI Design"
              },
              {
                id: 2,
                title: "Beginner's Guide to Design",
                instructor: "Ronald Richards",
                rating: 5,
                hours: 22,
                lectures: 150,
                level: "Beginner",
                price: 45,
                image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop",
                category: "UX/UI Design"
              },
              {
                id: 3,
                title: "Beginner's Guide to Design",
                instructor: "Ronald Richards",
                rating: 5,
                hours: 22,
                lectures: 150,
                level: "Beginner",
                price: 45,
                image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop",
                category: "UX/UI Design"
              },
              {
                id: 4,
                title: "Beginner's Guide to Design",
                instructor: "Ronald Richards",
                rating: 5,
                hours: 22,
                lectures: 150,
                level: "Beginner",
                price: 45,
                image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop",
                category: "UX/UI Design"
              }
            ].map((course) => (
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
                  />
                  {/* Category tag overlay */}
                    <div className="absolute top-3 left-3">
                    <span className="bg-purple-200 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                      {course.category}
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
                    By {course.instructor}
                    </div>
                    
                  {/* Rating - 5 stars */}
                      <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < course.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  
                  {/* Course Details - Hours, Lectures, Level */}
                  <div className="text-sm text-gray-700">
                    {course.hours} Total Hours. {course.lectures} Lectures. {course.level}
                      </div>
                  
                  {/* Price - Large, bold */}
                  <div className="pt-2">
                    <span className="text-xl font-bold text-gray-900">
                      ${course.price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
    </div>
  )
}

export default CourseDetailsPage
