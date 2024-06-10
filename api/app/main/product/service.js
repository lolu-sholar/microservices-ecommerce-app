const { cipher, jtoken, request } = require('../../utils')
const route = require('./route')
const config = require('../../manager/config')

// Get product categories
const getCategories = async(req, res) => {
	try {
		// Make request
		const response = await request.get(config.env().SERVICE_PRODUCT + route.getCategories, req.headers)
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

// Get product information
const getProductInformation = async(req, res) => {
	try {
		// Make request
		const response = await request.get(config.env().SERVICE_PRODUCT + request.parametize(route.getProduct, req.params), req.headers)
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

// Create product
const createProduct = async(req, res) => {
	try {
		// Make request
		const response = await request.post(config.env().SERVICE_PRODUCT + route.createProduct, req.body, req.headers)
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

// Update product
const updateProduct = async(req, res) => {
	try {
		// Make request
		const response = await request.post(config.env().SERVICE_PRODUCT + route.updateProduct, req.body, req.headers)
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

// Update product quantity
const updateProductQuantity = async(req, res) => {
	try {
		// Make request
		const response = await request.put(config.env().SERVICE_PRODUCT + route.updateProductQuantity, req.body, req.headers)
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

// Update product price
const updateProductPrice = async(req, res) => {
	try {
		// Make request
		const response = await request.put(config.env().SERVICE_PRODUCT + route.updateProductPrice, req.body, req.headers)
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

// Remove product
const removeProduct = async(req, res) => {
	try {
		// Make request
		const response = await request.delete(config.env().SERVICE_PRODUCT + request.parametize(route.removeProduct, req.params), req.headers)
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

module.exports = {
	getCategories,
	getProductInformation,
	createProduct,
	updateProduct,
	updateProductQuantity,
	updateProductPrice,
	removeProduct
}