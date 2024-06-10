const routerAuth = require('./auth/router')
const routerProfile = require('./profile/router')

exports.sync = () => {
	routerAuth.sync()
	routerProfile.sync()
}