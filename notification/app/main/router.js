const express = require('express')
const route = require('./route')
const controller = require('./controller')
const config = require('../manager/config')

// Define router
const router = express.Router()

// Map routes
// router.post(route.register, controller.register)

exports.sync = () => config.getApp().use(route.group, router)