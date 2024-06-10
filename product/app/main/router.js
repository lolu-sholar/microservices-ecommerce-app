const express = require('express')
const route = require('./route')
const controller = require('./controller')
const config = require('../manager/config')

// Define router
const router = express.Router()

// Map routes
router.get(route.getCategories, controller.getProductCategories)
router.get(route.getProduct, controller.getProductInformation)
router.post(route.createProduct, controller.createProduct)
router.post(route.updateProduct, controller.updateProduct)
router.put(route.updateProductQuantity, controller.updateProductQuantity)
router.put(route.updateProductPrice, controller.updateProductPrice)
router.delete(route.removeProduct, controller.removeProduct)

exports.sync = () => config.getApp().use(route.group, router)