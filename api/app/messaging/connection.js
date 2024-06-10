const amqp = require('amqplib/callback_api')
const config = require('../manager/config')

// Define connection object
let connectionObject = null

// Connection to rabbit server
exports.sync = () => {
	connectionObject = new Promise((resolve, reject) => {
		amqp.connect(config.env().RABBIT_SERVER, (err, conn) => {
			if (err) 
				reject(err)
			else
				resolve(conn)
		})
	})
}

// Return connection object
exports.connection = () => {
	return connectionObject
}