const mongoose = require('mongoose')
const config = require('../manager/config')

// Connect to db
exports.connect = () => {
	mongoose.connect(config.env().MONGO_URI)
	mongoose.connection.on('open', () => console.log("[STATUS] DB connected"))
	mongoose.connection.on('error', () => console.error("[ERROR] DB connection error"))
}

// Disconnect from db
exports.disconnect = () => {
	mongoose.disconnect()
}