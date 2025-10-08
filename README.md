# Byway Learning Platform

A modern, responsive online learning platform built with React.js and Tailwind CSS. This project replicates the design and functionality of popular e-learning platforms like Udemy.

## 🚀 Features

### Core Functionality
- **Landing Page** - Hero section with platform statistics, featured courses, top categories, and instructors
- **Course Catalog** - Browse courses with advanced filtering, search, sorting, and pagination
- **Course Details** - Comprehensive course information with curriculum, instructor details, and reviews
- **Shopping Cart** - Add/remove courses, view totals with tax calculation
- **Checkout Process** - Secure payment form with validation
- **User Authentication** - Login and registration with form validation
- **Responsive Design** - Fully responsive across all device sizes

### Technical Features
- **State Management** - Jotai for global state management
- **Routing** - React Router DOM for navigation
- **Form Validation** - Client-side validation for all forms
- **Local Storage** - Persistent cart and authentication state
- **Mock Data** - Comprehensive mock data for courses, instructors, and categories
- **Modern UI** - Clean, professional design matching the provided screenshots

## 🛠️ Tech Stack

- **Frontend Framework**: React.js (Latest version)
- **Styling**: Tailwind CSS
- **State Management**: Jotai
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 Project Structure

```
byway-learning/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with header and footer
│   ├── pages/
│   │   ├── HomePage.jsx        # Landing page
│   │   ├── LoginPage.jsx       # User login
│   │   ├── RegisterPage.jsx    # User registration
│   │   ├── CoursesPage.jsx     # Course catalog with filters
│   │   ├── CourseDetailsPage.jsx # Individual course details
│   │   ├── CartPage.jsx        # Shopping cart
│   │   ├── CheckoutPage.jsx    # Payment and checkout
│   │   └── PaymentSuccessPage.jsx # Success confirmation
│   ├── store/
│   │   └── atoms.js           # Jotai state atoms
│   ├── data/
│   │   └── mockData.js        # Mock data for courses, instructors, etc.
│   ├── types/
│   │   └── index.js           # JSDoc type definitions
│   ├── App.jsx                # Main app component
│   ├── main.jsx              # App entry point
│   └── style.css             # Global styles and Tailwind config
├── public/
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd byway-learning
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📱 Pages & Features

### 1. Landing Page (`/`)
- Hero section with call-to-action
- Platform statistics (courses, instructors, students)
- Top categories grid
- Featured courses carousel
- Top instructors showcase
- Newsletter signup

### 2. Authentication
- **Login Page** (`/login`) - Email/password login with social options
- **Register Page** (`/register`) - User registration with validation

### 3. Course Catalog (`/courses`)
- Course grid with pagination
- Advanced filtering (category, level, price, rating)
- Search functionality
- Sort options (newest, price, rating, popularity)
- Responsive design

### 4. Course Details (`/course/:id`)
- Course information and media
- Instructor details
- Course curriculum
- Student reviews
- Add to cart functionality
- Related courses

### 5. Shopping & Checkout
- **Cart Page** (`/cart`) - Review items, calculate totals
- **Checkout Page** (`/checkout`) - Payment form with validation
- **Success Page** (`/payment-success`) - Order confirmation

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9, #0284c7, #0369a1)
- **Secondary**: Purple (#ed57ff, #d935ee, #b821cc)
- **Gray Scale**: Various shades for text and backgrounds
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Sizes**: Responsive scale from xs to 6xl
- **Font Weights**: 300-900

### Components
- **Buttons**: Primary, secondary, outline variants
- **Cards**: Consistent shadow and border radius
- **Forms**: Styled inputs with focus states
- **Navigation**: Responsive header with mobile menu

## 🔧 State Management

The application uses Jotai for state management with the following atoms:

- `authAtom` - User authentication state
- `cartAtom` - Shopping cart items
- `coursesAtom` - Course data
- `searchQueryAtom` - Search functionality
- `selectedCategoryAtom` - Category filtering
- `selectedLevelAtom` - Level filtering
- `sortByAtom` - Sorting preferences
- `currentPageAtom` - Pagination state

## 📊 Mock Data

The application includes comprehensive mock data:

- **9 Courses** - Various categories and levels
- **5 Instructors** - With ratings and student counts
- **4 Categories** - Frontend, Backend, UI/UX Design, Web Design
- **Platform Statistics** - Student and course counts
- **User Reviews** - Sample course reviews

## 🔒 Authentication Flow

1. Users can register with email/password or social login
2. Login persists in localStorage
3. Protected routes redirect to login
4. Cart functionality requires authentication
5. Mock JWT token system

## 🛒 E-commerce Features

- Add courses to cart
- Remove items from cart
- Calculate subtotal, tax (15%), and total
- Persistent cart state
- Checkout with form validation
- Order confirmation

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Collapsible mobile menu
- **Grids**: Responsive course and category grids
- **Forms**: Stack on mobile, side-by-side on desktop

## 🔧 API Configuration

Create `.env.local` in the project root to point to your backend API:

```
VITE_API_BASE=http://localhost:5005/api
```

## 🚀 Future Enhancements

- API integration for real data
- User dashboard and profile management
- Course progress tracking
- Video player integration
- Payment gateway integration
- Advanced search with filters
- Wishlist functionality
- Course ratings and reviews system
- Instructor dashboard
- Admin panel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern e-learning platforms
- Tailwind CSS for the utility-first CSS framework
- React ecosystem for the robust development experience
- Unsplash for placeholder images
