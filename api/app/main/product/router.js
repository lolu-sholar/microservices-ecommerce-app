const express = require('express')
const route = require('./route')
const service = require('./service')
const config = require('../../manager/config')
const schema = require('./schema')
const validate = require('../../middleware/validateCipher')
const authenticate = require('../../middleware/authenticate')

// Define router
const router = express.Router()

// Map routes
router.get(route.getCategories, authenticate, service.getCategories)
router.get(route.getProduct, authenticate, service.getProductInformation)
router.post(route.createProduct, authenticate, validate(schema.createProduct), service.createProduct)
router.post(route.updateProduct, authenticate, validate(schema.updateProduct), service.updateProduct)
router.put(route.updateProductQuantity, authenticate, validate(schema.updateProductDetail), service.updateProductQuantity)
router.put(route.updateProductPrice, authenticate, validate(schema.updateProductDetail), service.updateProductPrice)
router.delete(route.removeProduct, authenticate, service.removeProduct)

exports.sync = () => config.getApp().use(route.group, router)