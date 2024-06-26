const config = require('../manager/config')

exports.run = () => {
	const port = parseInt(process.env.PORT, 10)
	// Listen on port
	config.getApp().listen(port, () => {
		console.log(`Notification microservice listening on ${port}`)
	})
}