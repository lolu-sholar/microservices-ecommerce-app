const { connection } = require('./connection')
const { cipher } = require('../utils')

// Send notification
exports.sendNotification = (payload) => {
	connection()
		.then(({ conn, channel }) => {
			// Define exchange and message
			const exchange = "notification"
			const message = cipher.encrypt(JSON.stringify(payload))

			// Ensure created before use
			channel.assertExchange(exchange, 'direct', {
				durable: false
			})
			// Define routing key
			const routingKey = `notification-${payload.type}`
			// Publish to exchange
			channel.publish(exchange, routingKey, Buffer.from(message))
		}).catch(err => console.debug(err))
}