const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { getAllUsersController, getAllDoctorController,changeAccountStatusController } = require('../controllers/adminctrl')
const router = express.Router()

router.get('/getAllUsers',authMiddleware,getAllUsersController)

router.get('/getAllDoctors',authMiddleware,getAllDoctorController)

router.post('/changeAccountStatus',authMiddleware,changeAccountStatusController)

module.exports = router