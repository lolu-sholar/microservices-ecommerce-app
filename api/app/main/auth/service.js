const { cipher, jtoken, request, futureDate } = require('../../utils')
const route = require('./route')
const config = require('../../manager/config')
const { Auth, mongoose } = require('./model')

// Register
const register = async(req, res) => {
	try {
		// Create json signature
		const signature = jtoken.create(req.body)

		// Make request
		const response = await request.post(config.env().SERVICE_USER + route.register, { signature })
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

// Verify email address
const verifyEmail = async(req, res) => {
	try {
		// Create json signature
		const signature = jtoken.create(req.body)

		// Make request
		const response = await request.put(config.env().SERVICE_USER + route.verifyEmail, { signature })
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

// Resend verification code
const resendVerificationCode = async(req, res) => {
	try {
		// Create json signature
		const signature = jtoken.create(req.body)

		// Make request
		const response = await request.put(config.env().SERVICE_USER + route.resendVerificationCode, { signature })
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

// Sign user in
const login = async(req, res) => {
	try {
		// Create json signature
		const signature = jtoken.create(req.body)

		// Make request
		const response = await request.post(config.env().SERVICE_USER + route.login, { signature })
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)

		// Get data object
		const userData = data.data
		
		// Cast account id
		const accountId = new mongoose.Types.ObjectId(userData.accountId)
		
		// Remove any prev auth sessions
		await Auth.deleteOne({
			userId: accountId
		})

		// Save new auth session id
		const authSession = new Auth({
			userId: accountId,
			clientId: cipher.encrypt(userData.clientSessionId),
			authExpiresIn: futureDate(24, 'hour')
		})
		await authSession.save()

		// Remove the unnecessary
		delete data.data['clientSessionId']
		delete data.data['accountId']
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

// Forgot password
const forgotPassword = async(req, res) => {
	try {
		// Create json signature
		const signature = jtoken.create(req.body)

		// Make request
		const response = await request.put(config.env().SERVICE_USER + route.forgotPassword, { signature })
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

// Resend password reset code
const resendPasswordResetCode = async(req, res) => {
	try {
		// Create json signature
		const signature = jtoken.create(req.body)

		// Make request
		const response = await request.put(config.env().SERVICE_USER + route.resendPasswordResetCode, { signature })
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

// Reset password
const resetPassword = async(req, res) => {
	try {
		// Create json signature
		const signature = jtoken.create(req.body)

		// Make request
		const response = await request.post(config.env().SERVICE_USER + route.resetPassword, { signature })
		const data = await response.json()

		if (data.error)
			return res.status(data.code).send(data.message)
		
		res.json(data)
	} catch(err) {
		res.sendStatus(500)
	}
}

// Check if session is valid
const isSessionValid = async(claims) => {
	try {
		const session = await Auth.findOne({
			userId: new mongoose.Types.ObjectId(cipher.decrypt(claims.id)),
			clientId: claims.cid
		})

		return Boolean(session)
	} catch(err) {
		return false
	}
}


module.exports = {
	register,
	verifyEmail,
	resendVerificationCode,
	login,
	forgotPassword,
	resendPasswordResetCode,
	resetPassword,
	isSessionValid
}