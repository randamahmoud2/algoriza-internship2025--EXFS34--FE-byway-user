import { useState } from 'react'
import { useAtom } from 'jotai'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCard } from 'lucide-react'
import { cartAtom, cartTotalAtom, authAtom } from '../store/atoms'
import { enrollmentApi } from '../utils/api'


const CheckoutPage = () => {
  const [cart] = useAtom(cartAtom)
  const [cartTotal] = useAtom(cartTotalAtom)
  const [auth] = useAtom(authAtom)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    country: '',
    state: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  const tax = cartTotal * 0.15
  const finalTotal = cartTotal + tax

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }

    if (paymentMethod === 'card') {
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Name on card is required'
      }

      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required'
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number'
      }

      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required'
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Please enter date in MM/YY format'
      }

      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required'
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV'
      }
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
    try {
      // Extract course IDs from cart
      const courseIds = cart.map(item => parseInt(item.courseId))
      
      // Process enrollment through API
      const result = await enrollmentApi.checkout(courseIds)
      
      console.log('Enrollment successful:', result)
      
      // Navigate to success page
      navigate('/payment-success')
    } catch (error) {
      console.error('Enrollment error:', error)
      setErrors({ submit: 'Enrollment failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect if cart is empty or user not authenticated
  if (cart.length === 0 || !auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {!auth.isAuthenticated ? 'Please log in to continue' : 'Your cart is empty'}
            </h2>
            <Link
              to={!auth.isAuthenticated ? '/login' : '/courses'}
              className="btn-primary inline-flex items-center"
            >
              {!auth.isAuthenticated ? 'Log In' : 'Browse Courses'}
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
          <Link to="/cart" className="hover:text-primary-600">Shopping Cart</Link>
          <span>/</span>
          <span className="text-primary-600 font-medium">Checkout</span>
        </nav>


        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout Page</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Billing Information */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Enter Country"
                      className={`input-field ${errors.country ? 'border-red-300 focus:ring-red-500' : ''}`}
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State/Union Territory
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter State"
                      className={`input-field ${errors.state ? 'border-red-300 focus:ring-red-500' : ''}`}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  {/* Credit/Debit Card */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Credit/Debit Card</span>
                        <div className="flex space-x-1 ml-4">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                        </div>
                      </div>
                    </label>

                    {paymentMethod === 'card' && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                            Name of Card
                          </label>
                          <input
                            id="cardName"
                            name="cardName"
                            type="text"
                            value={formData.cardName}
                            onChange={handleChange}
                            placeholder="Name of card"
                            className={`input-field ${errors.cardName ? 'border-red-300 focus:ring-red-500' : ''}`}
                          />
                          {errors.cardName && (
                            <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number
                          </label>
                          <input
                            id="cardNumber"
                            name="cardNumber"
                            type="text"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="Card Number"
                            className={`input-field ${errors.cardNumber ? 'border-red-300 focus:ring-red-500' : ''}`}
                          />
                          {errors.cardNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date
                            </label>
                            <input
                              id="expiryDate"
                              name="expiryDate"
                              type="text"
                              value={formData.expiryDate}
                              onChange={handleChange}
                              placeholder="MM/YY"
                              className={`input-field ${errors.expiryDate ? 'border-red-300 focus:ring-red-500' : ''}`}
                            />
                            {errors.expiryDate && (
                              <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                              CVC/CVV
                            </label>
                            <input
                              id="cvv"
                              name="cvv"
                              type="text"
                              value={formData.cvv}
                              onChange={handleChange}
                              placeholder="Enter Country"
                              className={`input-field ${errors.cvv ? 'border-red-300 focus:ring-red-500' : ''}`}
                            />
                            {errors.cvv && (
                              <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PayPal */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center space-x-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" alt="PayPal" className="h-6" />
                        <span className="font-medium">PayPal</span>
                      </div>
                    </label>
                  </div>
                </div>

                {errors.submit && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {errors.submit}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Details (3)</h3>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.courseId}>
                      <p className="text-sm text-gray-900 line-clamp-2 mb-1">
                        {item.course.title}
                      </p>
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage
