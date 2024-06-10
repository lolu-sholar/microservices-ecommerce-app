exports.server = require('./connection')

const notificationsQueue = require('./notifications-queue')
const notificationsExchange = require('./notifications-exchange')

exports.messages = {
	sync() {}
}

exports.notificationsQueue = notificationsQueue
exports.notificationsExchange = notificationsExchange
exports.types = require('./types')