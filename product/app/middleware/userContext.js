const { cipher, jtoken, currentUser } = require('../utils')

module.exports = async(req, res, next) => {
	let token = String(req.headers.authorization).split(' ')[1]
	let claims = await jtoken.verify(token)
	
	// Pass user object
	currentUser.set(cipher.encryptOrDecryptData(claims, true, ['iat', 'exp']))

	next()
}