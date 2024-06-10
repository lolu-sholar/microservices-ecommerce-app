const express = require('express')
const route = require('./route')
const service = require('./service')
const config = require('../../manager/config')
const schema = require('./schema')
const validate = require('../../middleware/validateValue')

// Define router
const router = express.Router()

// Map routes
router.post(route.register, validate(schema.register), service.register)
router.put(route.verifyEmail, validate(schema.verifyEmail), service.verifyEmail)
router.put(route.resendVerificationCode, validate(schema.resendCode), service.resendVerificationCode)
router.post(route.login, validate(schema.login), service.login)
router.put(route.forgotPassword, validate(schema.forgotPassword), service.forgotPassword)
router.put(route.resendPasswordResetCode, validate(schema.resendCode), service.resendPasswordResetCode)
router.post(route.resetPassword, validate(schema.resetPassword), service.resetPassword)

exports.sync = () => config.getApp().use(route.group, router)