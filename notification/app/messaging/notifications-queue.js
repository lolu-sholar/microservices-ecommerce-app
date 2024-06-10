const { connection } = require('./connection')
const { cipher } = require('../utils')

// Listen for notifications
exports.sync = () => {
	connection()
		.then(({ conn, channel }) => {
			// Define queue
			const queue = "notification"
			// Ensure created before use
			channel.assertQueue(queue, {
				durable: true
			})
			// Consume queue
			channel.consume(queue, (message) => {
				if (message.content) {
					console.log('Message received!', cipher.decrypt(message.content.toString()))
					// Acknowledge
					channel.ack(message)
				}
			}, {
				noAck: false
			})
		}).catch(err => console.debug(err))
}