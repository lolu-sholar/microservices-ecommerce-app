const mongoose = require('mongoose')

const ProductImageSchema = new mongoose.Schema({
	imageId: String,
	url: String,
	optimized: String,
	format: String,
	cropped: String
})

const ProductSchema = new mongoose.Schema({
	title: String,
	description: String,
	category: {
		type: mongoose.ObjectId,
		ref: 'productCategory'
	},
	quantity: Number,
	price: Number,
	photos: [ProductImageSchema],
	removed: {
		type: Boolean,
		default: false
	},
	owner: {
		type: mongoose.ObjectId,
		ref: 'user'
	}
}, { timestamps: true })

module.exports = mongoose.model('product', ProductSchema)