const express = require('express')
const router = express.Router()

const { newCourse, getAllCourses, getAvailableCourses, getSingleCourse, deleteCourse, updateCourse } = require('../controllers/courseController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/admin/new/course').post(isAuthenticatedUser, authorizeRoles('IT Dept Chair', 'CS Dept Chair', 'IS Dept Chair', 'CICS Office'), newCourse)
router.route('/courses').get(isAuthenticatedUser, getAllCourses)
router.route('/available/courses').get(isAuthenticatedUser, getAvailableCourses)
router.route('/course/:id').get(isAuthenticatedUser, getSingleCourse)
router.route('/admin/course/:id').put(isAuthenticatedUser, authorizeRoles('IT Dept Chair', 'CS Dept Chair', 'IS Dept Chair', 'CICS Office'), updateCourse)
router.route('/admin/course/:id').delete(isAuthenticatedUser, authorizeRoles('IT Dept Chair', 'CS Dept Chair', 'IS Dept Chair', 'CICS Office'), deleteCourse)

module.exports = router