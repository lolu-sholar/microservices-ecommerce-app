exports.server = require('./connection')

const notificationsExchange = require('./notifications-exchange')

exports.messages = {
	sync() {
		notificationsExchange.syncEmailMessages()
		notificationsExchange.syncSocketMessages()
	}
}