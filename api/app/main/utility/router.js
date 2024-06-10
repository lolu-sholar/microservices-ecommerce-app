const express = require('express')
const route = require('./route')
const service = require('./service')
const config = require('../../manager/config')

// Define router
const router = express.Router()

router.get(route.hello, service.hello)

exports.sync = () => {
	config.getApp().use(route.group, router)

	// Map route if dev
	if (config.env().STAGE == 'dev')
		router.post(route.cipher, service.transformPayload)
}