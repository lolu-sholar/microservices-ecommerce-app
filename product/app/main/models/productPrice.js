const mongoose = require('mongoose')

const ProductPriceSchema = new mongoose.Schema({
	productId: {
		type: mongoose.ObjectId,
		ref: 'product'
	},
	price: Number,
	owner: {
		type: mongoose.ObjectId,
		ref: 'user'
	}
}, { timestamps: true })

module.exports = mongoose.model('productPrice', ProductPriceSchema)