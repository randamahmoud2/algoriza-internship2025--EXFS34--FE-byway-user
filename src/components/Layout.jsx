import { useAtom } from 'jotai'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X, Bell, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { authAtom, cartCountAtom, syncAuthToken, searchQueryAtom } from '../store/atoms'
import { setAuthToken } from '../utils/api'

const Layout = ({ children }) => {
  const [auth, setAuth] = useAtom(authAtom)
  const [cartCount] = useAtom(cartCountAtom)
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Courses', href: '/courses' },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    const authData = { user: null, token: null, isAuthenticated: false }
    setAuth(authData)
    setAuthToken(null)
    syncAuthToken(authData)
    navigate('/')
  }

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    
    // If user is not on courses page, navigate there
    if (location.pathname !== '/courses') {
      navigate('/courses')
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 bg-teal-500 rounded-sm"></div>
                <div className="w-4 h-4 bg-blue-600 rounded-sm -ml-1"></div>
              </div>
              <span className="text-xl font-semibold text-gray-800">Byway</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses by name"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Logout Button - Only show when authenticated */}
              {auth.isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                  title="Logout"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              )}

              {/* Auth Buttons - Only show when not authenticated */}
              {!auth.isAuthenticated && (
                <div className="hidden md:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              {/* Mobile Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search courses by name"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth */}
              {!auth.isAuthenticated && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    to="/login"
                    className="block py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 text-sm font-medium text-primary-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto container-padding section-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold">Byway</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Empowering learners through accessible and engaging online education. 
                Byway is a leading online learning platform dedicated to providing 
                high-quality, flexible, and affordable educational experiences.
              </p>
            </div>

            {/* Get Help */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Get Help</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Latest Articles</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Programs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Programs</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Art & Design</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business</a></li>
                <li><a href="#" className="hover:text-white transition-colors">IT & Software</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Languages</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Programming</a></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Address: 123 Main Street, Anytown, CA 12345</p>
                <p>Tel: +123 456-7890</p>
                <p>Mail: byway@example.com</p>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-4 pt-4">
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <span className="text-xs font-bold">f</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <span className="text-xs font-bold">in</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <span className="text-xs font-bold">@</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <span className="text-xs font-bold">x</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
