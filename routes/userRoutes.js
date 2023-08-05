const express = require('express')
const { loginController, 
    registerController,authcontroller,applydoctorcontroller,getAllNotificationcontroller,
    deleteAllNotificationcontroller,getAllDoctorsController,bookAppointmentController,bookingAvailabilityController
,userAppointmentsController } = require('../controllers/userctrl')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/login',loginController)
router.post('/register',registerController)

router.post("/getUserData",authMiddleware,authcontroller)

router.post("/apply-doctor",authMiddleware,applydoctorcontroller)
router.post("/get-all-notification",authMiddleware,getAllNotificationcontroller)
router.post("/delete-all-notification",authMiddleware,deleteAllNotificationcontroller)

router.get('/getAllDoctors',authMiddleware,getAllDoctorsController)

router.post('/book-appointment',authMiddleware,bookAppointmentController)

router.post('/booking-availbility',authMiddleware,bookingAvailabilityController)

router.get('/user-appointments',authMiddleware,userAppointmentsController)

module.exports = router