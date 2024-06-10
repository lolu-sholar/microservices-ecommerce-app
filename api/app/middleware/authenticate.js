const { cipher, jtoken } = require('../utils')
const service = require('../main/auth/service')

module.exports = async(req, res, next) => {
	let token = String(req.headers.authorization).split(' ')[1]
	let claims = await jtoken.verify(token)
	if (!claims || (claims && !(await service.isSessionValid(claims))))
		return res.status(401).end('Unauthorized access.')

	next()
}