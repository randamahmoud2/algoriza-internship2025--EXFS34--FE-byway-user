export const courses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    description: "Learn full-stack web development with modern technologies including React, Node.js, and MongoDB.",
    shortDescription: "Learn full-stack web development with modern technologies...",
    price: 199,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
    video: "https://example.com/video1.mp4",
    level: "Beginner",
    duration: 40,
    lectures: 120,
    rating: 4.8,
    ratingCount: 1250,
    instructor: {
      id: "1",
      name: "John Smith",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      specialization: "Full Stack Development"
    },
    category: {
      id: "1",
      name: "Web Development"
    },
    isActive: true,
    isPublished: true
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    description: "Master advanced React patterns, hooks, and state management techniques for building scalable applications.",
    shortDescription: "Master advanced React patterns, hooks, and state management...",
    price: 149,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    video: "https://example.com/video2.mp4",
    level: "Advanced",
    duration: 25,
    lectures: 80,
    rating: 4.9,
    ratingCount: 890,
    instructor: {
      id: "2",
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      specialization: "Frontend Development"
    },
    category: {
      id: "1",
      name: "Web Development"
    },
    isActive: true,
    isPublished: true
  },
  {
    id: "3",
    title: "Python for Data Science",
    description: "Learn Python programming and data science libraries including Pandas, NumPy, and Matplotlib.",
    shortDescription: "Learn Python programming and data science libraries...",
    price: 179,
    image: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=400&h=250&fit=crop",
    video: "https://example.com/video3.mp4",
    level: "Intermediate",
    duration: 35,
    lectures: 95,
    rating: 4.7,
    ratingCount: 1100,
    instructor: {
      id: "3",
      name: "Dr. Michael Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      specialization: "Data Science"
    },
    category: {
      id: "2",
      name: "Data Science"
    },
    isActive: true,
    isPublished: true
  },
  {
    id: "4",
    title: "Mobile App Development with Flutter",
    description: "Build cross-platform mobile applications using Flutter and Dart programming language.",
    shortDescription: "Build cross-platform mobile applications using Flutter...",
    price: 159,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    video: "https://example.com/video4.mp4",
    level: "Intermediate",
    duration: 30,
    lectures: 85,
    rating: 4.6,
    ratingCount: 750,
    instructor: {
      id: "4",
      name: "Emily Rodriguez",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      specialization: "Mobile Development"
    },
    category: {
      id: "3",
      name: "Mobile Development"
    },
    isActive: true,
    isPublished: true
  }
]

export const categories = [
  {
    id: "1",
    name: "Web Development",
    description: "Learn modern web development technologies",
    courseCount: 25,
    icon: "🖥️"
  },
  {
    id: "2",
    name: "Data Science",
    description: "Master data analysis and machine learning",
    courseCount: 18,
    icon: "📊"
  },
  {
    id: "3",
    name: "Mobile Development",
    description: "Build mobile applications for iOS and Android",
    courseCount: 12,
    icon: "📱"
  },
  {
    id: "4",
    name: "UI/UX Design",
    description: "Create beautiful and user-friendly interfaces",
    courseCount: 15,
    icon: "🎨"
  }
]

export const instructors = [
  {
    id: "1",
    name: "John Smith",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    specialization: "Full Stack Development",
    rating: 4.9,
    courseCount: 8,
    studentCount: 2500
  },
  {
    id: "2",
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    specialization: "Frontend Development",
    rating: 4.8,
    courseCount: 6,
    studentCount: 1800
  },
  {
    id: "3",
    name: "Dr. Michael Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    specialization: "Data Science",
    rating: 4.9,
    courseCount: 5,
    studentCount: 2200
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    specialization: "Mobile Development",
    rating: 4.7,
    courseCount: 4,
    studentCount: 1500
  },
  {
    id: "5",
    name: "David Wilson",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    specialization: "UI/UX Design",
    rating: 4.8,
    courseCount: 7,
    studentCount: 1900
  }
]

export const platformStats = {
  totalStudents: 15000,
  totalCourses: 85,
  totalInstructors: 25,
  completionRate: 92
}
