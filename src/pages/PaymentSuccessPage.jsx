import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { Link } from 'react-router-dom'
import { CheckCircle, Home, BookOpen } from 'lucide-react'
import { cartAtom } from '../store/atoms'

const PaymentSuccessPage = () => {
  const [, setCart] = useAtom(cartAtom)

  useEffect(() => {
    // Clear cart after successful payment
    setCart([])
  }, [setCart])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full container-padding">
        <div className="card p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for your purchase! Your courses have been added to your account 
            and you can start learning right away.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">Order Confirmation</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Order ID: #BW-{Date.now().toString().slice(-6)}</p>
              <p>Payment Method: Credit Card</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/courses"
              className="w-full btn-primary py-3 flex items-center justify-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Browse More Courses
            </Link>
            
            <Link
              to="/"
              className="w-full btn-outline py-3 flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              A confirmation email has been sent to your registered email address. 
              You can access your courses anytime from your dashboard.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-600">1</span>
              </div>
              <p>Check your email for course access details and receipts</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-600">2</span>
              </div>
              <p>Start learning immediately with lifetime access to your courses</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-600">3</span>
              </div>
              <p>Join our community and connect with other learners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage
