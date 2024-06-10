const express = require('express')
const route = require('./route')
const controller = require('./controller')
const config = require('../../manager/config')

// Define router
const router = express.Router()

// Map routes
router.post(route.register, controller.register)
router.put(route.verifyEmail, controller.verifyEmail)
router.put(route.resendVerificationCode, controller.resendVerificationCode)
router.post(route.login, controller.login)
router.put(route.forgotPassword, controller.forgotPassword)
router.put(route.resendPasswordResetCode, controller.resendPasswordResetCode)
router.post(route.resetPassword, controller.resetPassword)

exports.sync = () => config.getApp().use(route.group, router)