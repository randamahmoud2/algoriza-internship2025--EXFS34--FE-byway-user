// Type definitions as JSDoc comments for better IDE support

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} avatar
 * @property {string} jobTitle
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} shortDescription
 * @property {number} price
 * @property {string} image
 * @property {string} video
 * @property {string} level
 * @property {number} duration
 * @property {number} lectures
 * @property {string} category
 * @property {string} categoryId
 * @property {Instructor} instructor
 * @property {number} rating
 * @property {number} studentsCount
 * @property {string[]} tags
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Instructor
 * @property {string} id
 * @property {string} name
 * @property {string} title
 * @property {string} avatar
 * @property {number} rating
 * @property {number} studentsCount
 * @property {number} coursesCount
 * @property {string} bio
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {number} coursesCount
 */

/**
 * @typedef {Object} CartItem
 * @property {string} courseId
 * @property {Course} course
 * @property {Date} addedAt
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user
 * @property {string|null} token
 * @property {boolean} isAuthenticated
 */

export {}
