const mongoose = require('mongoose')

const ProductQuantitySchema = new mongoose.Schema({
	productId: {
		type: mongoose.ObjectId,
		ref: 'product'
	},
	quantity: Number,
	owner: {
		type: mongoose.ObjectId,
		ref: 'user'
	}
}, { timestamps: true })

module.exports = mongoose.model('productQuantity', ProductQuantitySchema)