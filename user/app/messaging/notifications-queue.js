const { connection } = require('./connection')
const { cipher } = require('../utils')

// Send notification
exports.sendNotification = (payload) => {
	connection()
		.then(({ conn, channel }) => {
			// Define queue and message
			const queue = "notification"
			const message = cipher.encrypt(JSON.stringify(payload))

			// Ensure created before use
			channel.assertQueue(queue, {
				durable: true
			})
			// Publish to queue
			channel.sendToQueue(queue, Buffer.from(message))
		}).catch(err => console.debug(err))
}