const mongoose = require('mongoose')
const { NotificationCategoryType, NotificationType } = require('./types')

const NotificationSchema = new mongoose.Schema({
	body: String,
	category: {
		type: String,
		enum: NotificationCategoryType
	},
	actionUser: {
		type: mongoose.ObjectId,
		ref: 'User'
	},
	data: Object,
	type: {
		type: String,
		enum: NotificationType
	},
	passwordResetCode: String,
	read: Boolean,
	owner: {
		type: mongoose.ObjectId,
		ref: 'user'
	}
}, { timestamps: true })

exports.Notification = mongoose.model('notification', NotificationSchema)