import { useAtom } from 'jotai'
import { Link } from 'react-router-dom'
import { Trash2, Star, Clock } from 'lucide-react'
import { cartAtom, cartTotalAtom, authAtom } from '../store/atoms'

const CartPage = () => {
  const [cart, setCart] = useAtom(cartAtom)
  const [cartTotal] = useAtom(cartTotalAtom)
  const [auth] = useAtom(authAtom)

  const removeFromCart = (courseId) => {
    setCart(prev => prev.filter(item => item.courseId !== courseId))
  }

  const tax = cartTotal * 0.15 // 15% tax
  const finalTotal = cartTotal + tax

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any courses to your cart yet.
            </p>
            <Link
              to="/courses"
              className="btn-primary inline-flex items-center"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto container-padding">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/courses" className="hover:text-primary-600">Courses</Link>
          <span>/</span>
          <Link to="/course/1" className="hover:text-primary-600">Details</Link>
          <span>/</span>
          <span className="text-primary-600 font-medium">Shopping Cart</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {cart.length} Course{cart.length !== 1 ? 's' : ''} in cart
                </h2>
              </div>

              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.courseId} className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                    <img
                      src={item.course.image}
                      alt={item.course.title}
                      className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {item.course.title}
                      </h3>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        by {item.course.instructor.name}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{item.course.rating}</span>
                          <span>({item.course.studentsCount})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{item.course.duration} Total Hours</span>
                        </div>
                        <span>{item.course.lectures} Lectures</span>
                        <span>All levels</span>
                      </div>
                      
                      <div className="mt-2">
                        <button
                          onClick={() => removeFromCart(item.courseId)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className="text-lg font-bold text-primary-600">
                        ${item.course.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.courseId)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Details ({cart.length})</h3>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.courseId} className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {item.course.title}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ${item.course.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {auth.isAuthenticated ? (
                  <Link
                    to="/checkout"
                    className="w-full btn-primary py-3 text-center block"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 text-center">
                      Please log in to continue with checkout
                    </p>
                    <Link
                      to="/login"
                      className="w-full btn-primary py-3 text-center block"
                    >
                      Log In to Checkout
                    </Link>
                  </div>
                )}
                
                <Link
                  to="/courses"
                  className="w-full btn-outline py-3 text-center block"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Coupon Code */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm font-medium text-gray-900">💰</span>
                  <span className="text-sm font-medium text-gray-900">APPLY COUPON CODE</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 input-field text-sm"
                  />
                  <button className="btn-outline px-4 py-2 text-sm">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
