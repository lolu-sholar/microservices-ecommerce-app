const routerAuth = require('./auth/router')
const routerProduct = require('./product/router')
const routerUtility = require('./utility/router')

exports.sync = () => {
	routerAuth.sync()
	routerProduct.sync()
	routerUtility.sync()
}