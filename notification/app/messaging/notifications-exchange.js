const { connection } = require('./connection')
const { cipher } = require('../utils')
const { NotificationType } = require('../main/types')
const service = require('../main/service')

// Listen for notifications / email
exports.syncEmailMessages = () => {
	connection()
		.then(({ conn, channel }) => {
			// Define exchange
			const exchange = "notification"
			// Ensure created before use
			channel.assertExchange(exchange, 'direct', {
				durable: false
			})
			// Declare queue as temporary
			channel.assertQueue('', {
				exclusive: true
			}, (err, q) => {
				if (err)
					console.debug(err)
				else {
					// Define keys and bind queue
					[`notification-${NotificationType.All}`, `notification-${NotificationType.Email}`]
					.map(key => channel.bindQueue(q.queue, exchange, key))
					// Consume queue
					channel.consume(q.queue, (message) => {
						if (message.content) {
							// Extract and convert data
							const payload = JSON.parse(cipher.decrypt(message.content.toString()))

							// Send to service
							service.sendMail(payload)
							
							// Acknowledge / will be ignored
							channel.ack(message)
						}
					}, {
						noAck: false
					})
				}
			})
		}).catch(err => console.debug(err))
}

// Listen for notifications / socket
exports.syncSocketMessages = () => {
	connection()
		.then(({ conn, channel }) => {
			// Define exchange
			const exchange = "notification"
			// Ensure created before use
			channel.assertExchange(exchange, 'direct', {
				durable: false
			})
			// Declare queue as temporary
			channel.assertQueue('', {
				exclusive: true
			}, (err, q) => {
				if (err)
					console.debug(err)
				else {
					// Define keys and bind queue
					[`notification-${NotificationType.All}`, `notification-${NotificationType.Socket}`]
					.map(key => channel.bindQueue(q.queue, exchange, key))
					// Consume queue
					channel.consume(q.queue, (message) => {
						if (message.content) {
							// Extract and convert data
							const payload = JSON.parse(cipher.decrypt(message.content.toString()))

							// Acknowledge / will be ignored
							channel.ack(message)
						}
					}, {
						noAck: false
					})
				}
			})
		}).catch(err => console.debug(err))
}