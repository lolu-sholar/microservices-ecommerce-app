const mongoose = require('mongoose')

const AuthSchema = new mongoose.Schema({
	userId: {
		type: mongoose.ObjectId,
		ref: 'User'
	},
	clientId: String,
	authExpiresIn: {
		type: Date,
		expires: 86400
	},
}, { timestamps: true })

exports.Auth = mongoose.model('auth', AuthSchema)
exports.mongoose = mongoose