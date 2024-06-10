const mongoose = require('mongoose')

const ProductCategorySchema = new mongoose.Schema({
	title: String,
	description: String
})

module.exports = mongoose.model('productCategory', ProductCategorySchema)