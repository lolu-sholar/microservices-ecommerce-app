const mailer = require('../utils/mailer')
const models = require('./models')
const mongoose = require('mongoose')
const { cipher, helpers, cloudinary, currentUser } = require('../utils')
const { Ok, Rebuke } = require('../utils/response')
const data = require('./data/product-category')
const { notificationsExchange, types } = require('../messaging')

// Get product categories
const getCategories = async() => {
	try {
		const categories = await models.ProductCategory.find()

		return new Ok(categories)
	} catch(err) {
		return new Rebuke('Error getting product categories.')
	}
}

// Get product information
const getProductInformation = async(params) => {
	try {
		const productId = cipher.decrypt(params.id)
		const product = await models.Product.findById(productId)

		if (!product || (product && product.removed))
			return new Rebuke('Product is not valid.')

		return new Ok(product)
	} catch(err) {
		return new Rebuke('Error getting product information.')
	}
}

// Create product
const createProduct = async(body) => {
	try {
		// Decrypt data
		const payload = cipher.encryptOrDecryptData(body, true, ["photos"])

		const productDuplicate = await models.Product.findOne({
			title: payload.title,
			category: payload.category,
			removed: false,
			owner: currentUser.get('oid')
		})

		// Check if exists
		if (productDuplicate)
			return new Rebuke('Product with same title and category already exists.')

		// Decorate photos to upload
		const photos = payload.photos.map(p => ({
			id: helpers.uuidClean(),
			data: p
		}))

		// Upload photos
		const uploadedPhotos = await cloudinary.upload(photos)

		// Check if image uploaded successfully
		if (uploadedPhotos && uploadedPhotos.length) {
			const product = new models.Product({
				title: payload.title,
				description: payload.description,
				category: payload.category,
				quantity: Number(payload.quantity),
				price: Number(payload.price),
				photos: uploadedPhotos,
				owner: currentUser.get('oid')
			})

			const status = await product.save()

			// Check if success
			if (!status?.id)
				return new Rebuke('Product could not be saved.')

			// Save quantity
			saveProductQuantity(product)
			// Save price
			saveProductPrice(product)

			// Notification service
			notificationsExchange.sendNotification({
				type: types.NotificationType.All,
				id: currentUser.get('id'),
				email: {
					to: currentUser.get('email'),
					message: `A new product with name "${product.title}" has just been added.`,
					subject: 'Product Added',
					date: new Date()
				}
			})

			return new Ok()
		}

		return new Rebuke('Error while saving product information.')
	} catch(err) {
		return new Rebuke('Error while creating product.')
	}
}

// Update product
const updateProduct = async(body) => {
	try {
		// Decrypt data
		const payload = cipher.encryptOrDecryptData(body, true, ["photos"])

		const productDuplicate = await models.Product.findOne({
			title: payload.title,
			category: payload.category,
			removed: false,
			owner: currentUser.get('oid')
		})

		// Check if exists
		if (productDuplicate && String(productDuplicate._id) != payload.id)
			return new Rebuke('Product with same title and category already exists.')

		const product = await models.Product.findById(payload.id)

		// Check if product is marked as removed
		if (product.removed)
			return new Rebuke("Product you're trying to update is not valid.")

		let newPhotos = [], oldPhotos = []

		// Decorate photos to upload
		payload.photos.map(p => {
			if (p.match(/^https/))
				oldPhotos.push(p)
			else newPhotos.push({ id: helpers.uuidClean(), data: p })
		})

		// Upload photos
		const uploadedPhotos = newPhotos.length ? await cloudinary.upload(newPhotos) : newPhotos

		const photosToDelete = []

		// Get photos to update and photos to delete 
		Array.from(product.photos, p => {
			if (oldPhotos.includes(p.optimized))
				uploadedPhotos.push(p)
			else photosToDelete.push(p.imageId)
		})

		// Update product details
		product.title = payload.title
		product.description = payload.description
		product.category = payload.category
		product.photos = uploadedPhotos

		const status = await product.save()

		// Check if success
		if (!status?.id)
			return new Rebuke('Product could not be updated.')
		
		// Delete unneeded photos
		if (photosToDelete.length)
			cloudinary.destroy(photosToDelete)

		// Notification service
		notificationsExchange.sendNotification({
			type: types.NotificationType.All,
			id: currentUser.get('id'),
			email: {
				to: currentUser.get('email'),
				message: `Product with name "${product.title}" was just updated.`,
				subject: 'Product Updated',
				date: new Date()
			}
		})

		return new Ok()
	} catch(err) {
		return new Rebuke('Error while updating product.')
	}
}

// Update product quantity
const updateProductQuantity = async(body) => {
	try {
		// Decrypt data
		const payload = cipher.encryptOrDecryptData(body, true)

		const product = await models.Product.findById(payload.id)

		// Check if product is marked as removed
		if (product.removed)
			return new Rebuke("Product you're trying to update is not valid.")

		// Update product quantity
		product.quantity = product.quantity + Number(payload.value)

		const status = await product.save()

		// Check if success
		if (!status?.id)
			return new Rebuke('Product quantity could not be updated.')
		
		// Save quantity
		saveProductQuantity(product, payload.value)

		// Notification service
		notificationsExchange.sendNotification({
			type: types.NotificationType.All,
			id: currentUser.get('id'),
			email: {
				to: currentUser.get('email'),
				message: `Quantity updated for product with name "${product.title}".`,
				subject: 'Product Quantity Updated',
				date: new Date()
			}
		})

		return new Ok()
	} catch(err) {
		return new Rebuke('Error while updating product quantity.')
	}
}

// Update product price
const updateProductPrice = async(body) => {
	try {
		// Decrypt data
		const payload = cipher.encryptOrDecryptData(body, true)

		const product = await models.Product.findById(payload.id)

		// Check if product is marked as removed
		if (product.removed)
			return new Rebuke("Product you're trying to update is not valid.")

		// Update product quantity
		product.price = Number(payload.value)

		const status = await product.save()

		// Check if success
		if (!status?.id)
			return new Rebuke('Product price could not be updated.')
		
		// Save price
		saveProductPrice(product, payload.value)

		// Notification service
		notificationsExchange.sendNotification({
			type: types.NotificationType.All,
			id: currentUser.get('id'),
			email: {
				to: currentUser.get('email'),
				message: `Price updated for product with name "${product.title}".`,
				subject: 'Product Price Updated',
				date: new Date()
			}
		})

		return new Ok()
	} catch(err) {
		return new Rebuke('Error while updating product price.')
	}
}

// Remove product
const removeProduct = async(params) => {
	try {
		const productId = cipher.decrypt(params.id)
		const product = await models.Product.findById(productId)

		if (!product)
			return new Rebuke('Product is not valid.')

		if (product.removed)
			return new Rebuke('Invalid operation.')

		// Update value
		product.removed = true

		const status = await product.save()

		// Notification service
		notificationsExchange.sendNotification({
			type: types.NotificationType.All,
			id: currentUser.get('id'),
			email: {
				to: currentUser.get('email'),
				message: `Product with name "${product.title}" is no longer active.`,
				subject: 'Product Removed',
				date: new Date()
			}
		})

		return new Ok()
	} catch(err) {
		return new Rebuke('Error while removing product.')
	}
}

// Save product quantity
const saveProductQuantity = async(product, quantity) => {
	try {
		// Create product quantity document 
		const productQuantity = new models.ProductQuantity({
			productId: new mongoose.Types.ObjectId(product.id),
			quantity: Number(quantity ?? product.quantity),
			owner: currentUser.get('oid')
		})
		// Save quantity document
		await productQuantity.save()
	} catch {
		return null
	}
}

// Save product price
const saveProductPrice = async(product, price) => {
	try {
		// Create product price document 
		const productPrice = new models.ProductPrice({
			productId: new mongoose.Types.ObjectId(product.id),
			price: Number(price ?? product.price),
			owner: currentUser.get('oid')
		})
		// Save price document
		await productPrice.save()
	} catch {
		return null
	}
}

// Seed product categories
const seedCategories = (async() => {
	try {
		const categories = await models.ProductCategory.find()

		const message = `Default Product categories`

		// Check count
		if (!categories.length) {
			let newCategories = []
			for (const cat of data.categories) {
				newCategories.push({
					title: cat[0],
					description: cat[1]
				})
			}
			
			const status = await models.ProductCategory.insertMany(newCategories)

			// Check if data seeded
			if (!status.length)
				return helpers.error(`[ERROR] %s not seeded!`, message)
		}

		helpers.log('[STATUS] %s seeded.', message)
	} catch(err) {
		helpers.error('[ERROR] Error while seeding product categories:', err)
	}
})()

module.exports = {
	getCategories,
	getProductInformation,
	createProduct,
	updateProduct,
	updateProductQuantity,
	updateProductPrice,
	removeProduct
}