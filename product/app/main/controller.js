const { cipher, currentUser } = require('../utils')
const service = require('./service')

// Get product categories
const getProductCategories = async(req, res) => {
	try {
		const status = await service.getCategories()

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

// Get product information
const getProductInformation = async(req, res) => {
	try {
		const status = await service.getProductInformation(req.params)

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

// Create product
const createProduct = async(req, res) => {
	try {
		const status = await service.createProduct(req.body)

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

// Update product
const updateProduct = async(req, res) => {
	try {
		const status = await service.updateProduct(req.body)

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

// Update product quantity
const updateProductQuantity = async(req, res) => {
	try {
		const status = await service.updateProductQuantity(req.body)

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

// Update product price
const updateProductPrice = async(req, res) => {
	try {
		const status = await service.updateProductPrice(req.body)

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

// Remove product
const removeProduct = async(req, res) => {
	try {
		const status = await service.removeProduct(req.params)

		res.json(status)
	} catch {
		res.sendStatus(500)
	}
}

module.exports = {
	getProductCategories,
	getProductInformation,
	createProduct,
	updateProduct,
	updateProductQuantity,
	updateProductPrice,
	removeProduct
}