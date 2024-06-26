const { cipher, jtoken, helpers, futureDate, env } = require('../../utils')
const { Ok, Rebuke } = require('../../utils/response')
const { User } = require('../profile/model')
const mailer = require('../../utils/mailer')
const argon2 = require('argon2')
const { notificationsExchange, types } = require('../../messaging')

// Registration service
const userRegistration = async(body) => {
	try {
		const data = await jtoken.verify(body.signature)

		// Check signature
		if (!data)
			return new Rebuke('Invalid operation.')

		// Decrypt data
		const payload = cipher.encryptOrDecryptData(data, true)

		const condition = {
			email: cipher.encrypt(payload.email)
		}

		const account = await User.findOne(condition)

		if (account) {
			if (account.userVerified)
				return new Rebuke('Email is already taken.')
			else {
				const deleteStatus = await User.deleteOne(condition)
				if (!deleteStatus?.deletedCount)
					return new Rebuke('An error occurred during registration. Please try again.')
			}
		}

		// Generate verification code
		const code = helpers.code()

		const verificationDetail = {
			code,
			expires: futureDate(1, 'hour'),
			token: cipher.encrypt(await argon2.hash(code))
		}

		// Log in dev mode
		helpers.log(verificationDetail)

		const user = new User({
			...condition,
			name: payload.name,
			password: await argon2.hash(payload.password),
			userType: payload.type,
			verificationCode: cipher.encrypt(verificationDetail.code),
			verificationExpiresIn: verificationDetail.expires,
			verificationToken: verificationDetail.token,
		})
		const opStatus = await user.save()

		if (!opStatus?.id)
			return new Rebuke('Registration failed. Please try again.')

		// Notification service
		notificationsExchange.sendNotification({
			type: types.NotificationType.Email,
			email: {
				to: payload.email,
				message: `Please use the code '${verificationDetail.code}' to verify your email.`,
				subject: 'Email Verification Code'
			}
		})

		return new Ok({
			message: 'Registration successful. Please check your inbox for verification code.',
			data: {
				token: verificationDetail.token
			}
		})
	} catch(err) {
		return new Rebuke('Error during registration.')
	}
}

// Verify email address
const verifyEmailAddress = async(body) => {
	try {
		const data = await jtoken.verify(body.signature)

		// Check signature
		if (!data)
			return new Rebuke('Invalid operation.')

		// Decrypt data
		const payload = cipher.encryptOrDecryptData(data, true)

		const condition = {
			email: cipher.encrypt(payload.email),
			verificationCode: cipher.encrypt(payload.code),
			verificationToken: payload.token
		}

		const account = await User.findOne(condition)
		
		if (!account || (account && !(await argon2.verify(cipher.decrypt(payload.token), payload.code))))
			return new Rebuke('Invalid credentials.')

		account.verificationCode = null
		account.verificationExpiresIn = null
		account.verificationToken = null
		account.userVerified = true
		const opStatus = await account.save()

		if (!opStatus?.id)
			return new Rebuke('Verification failed. Please try again.')

		// Notification service
		notificationsExchange.sendNotification({
			type: types.NotificationType.Email,
			email: {
				to: payload.email,
				message: `Your account has been successfully verified.`,
				subject: 'Email Verification'
			}
		})

		return new Ok('Verification successful. Please sign in to your account.')
	} catch(err) {
		return new Rebuke('Error during verification.')
	}
}

// Resend verification code
const resendVerificationCode = async(body) => {
	try {
		const data = await jtoken.verify(body.signature)

		// Check signature
		if (!data)
			return new Rebuke('Invalid operation.')

		// Decrypt data
		const payload = cipher.encryptOrDecryptData(data, true)

		const condition = {
			email: cipher.encrypt(payload.email),
			verificationToken: payload.token
		}

		const account = await User.findOne(condition)
		
		if (!account)
			return new Rebuke('Invalid operation.')

		// Generate verification code
		const code = helpers.code()

		const verificationDetail = {
			code,
			expires: futureDate(1, 'hour'),
			token: cipher.encrypt(await argon2.hash(code))
		}

		// Log in dev mode
		helpers.log(verificationDetail)

		account.verificationCode = cipher.encrypt(verificationDetail.code)
		account.verificationExpiresIn = verificationDetail.expires
		account.verificationToken = verificationDetail.token
		const opStatus = await account.save()

		if (!opStatus?.id)
			return new Rebuke('Verification code could not be resent. Please try again.')

		// Notification service
		notificationsExchange.sendNotification({
			type: types.NotificationType.Email,
			email: {
				to: payload.email,
				message: `Please use the code '${verificationDetail.code}' to verify your email.`,
				subject: 'Email Verification Code'
			}
		})

		return new Ok({
			message: 'Verification code resent.',
			data: {
				token: verificationDetail.token
			}
		})
	} catch(err) {
		return new Rebuke('Error while sending verification code.')
	}
}

// Sign user in
const signUserIn = async(body) => {
	try {
		const data = await jtoken.verify(body.signature)

		// Check signature
		if (!data)
			return new Rebuke('Invalid operation.')
		
		// Decrypt data
		const payload = cipher.encryptOrDecryptData(data, true)

		const condition = {
			email: cipher.encrypt(payload.email)
		}

		const account = await User.findOne(condition)

		if (!account || (account && !(await argon2.verify(account.password, payload.password))))
			return new Rebuke('Invalid credentials.')

		// Notification service
		notificationsExchange.sendNotification({
			type: types.NotificationType.Email,
			email: {
				to: payload.email,
				message: `Sign-in activity detected on account at ${new Date()}.`,
				subject: 'Sign In Activity'
			}
		})

		const clientSessionId = helpers.uuid()

		const token = jtoken.create({
			...condition,
			id: cipher.encrypt(String(account._id)),
			cid: cipher.encrypt(clientSessionId)
		}, '24h')
		
		return new Ok({
			message: 'Sign in successful.',
			data: {
				name: account.name,
				email: payload.email,
				type: account.userType,
				accessToken: token,
				accountId: account._id,
				clientSessionId
			}
		})
	} catch(err) {
		return new Rebuke('Error when signing in.')
	}
}

// Generate password reset code
const generatePasswordResetCode = async(body) => {
	try {
		const data = await jtoken.verify(body.signature)

		// Check signature
		if (!data)
			return new Rebuke('Invalid operation.')

		// Decrypt data
		const payload = cipher.encryptOrDecryptData(data, true)

		const condition = {
			email: cipher.encrypt(payload.email)
		}

		const account = await User.findOne(condition)
		
		if (!account || (account && !account.userVerified))
			return new Rebuke('Invalid operation.')

		// Generate reset code
		const code = helpers.code()

		const resetDetail = {
			code,
			expires: futureDate(10, 'minutes'),
			token: cipher.encrypt(await argon2.hash(code))
		}

		// Log in dev mode
		helpers.log(resetDetail)

		account.passwordResetCode = cipher.encrypt(resetDetail.code)
		account.passwordResetExpiresIn = resetDetail.expires
		account.passwordResetToken = resetDetail.token
		const opStatus = await account.save()

		if (!opStatus?.id)
			return new Rebuke('Password reset code could not be generated. Please try again.')

		// Notification service
		notificationsExchange.sendNotification({
			type: types.NotificationType.Email,
			email: {
				to: payload.email,
				message: `Please use the code '${resetDetail.code}' to reset your password.`,
				subject: 'Password Reset Code'
			}
		})

		return new Ok({
			message: 'Password reset code sent. Please check your inbox',
			data: {
				token: resetDetail.token
			}
		})
	} catch(err) {
		return new Rebuke('Error while sending reset code.')
	}
}

// Resend password reset code
const resendPasswordResetCode = async(body) => {
	try {
		const data = await jtoken.verify(body.signature)

		// Check signature
		if (!data)
			return new Rebuke('Invalid operation.')

		// Decrypt data
		const payload = cipher.encryptOrDecryptData(data, true)

		const condition = {
			email: cipher.encrypt(payload.email),
			passwordResetToken: payload.token
		}

		const account = await User.findOne(condition)
		
		if (!account)
			return new Rebuke('Invalid operation.')

		// Check if operation has not expired
		if (futureDate.isTimeBeforeNow(account.passwordResetExpiresIn)) {
			account.passwordResetCode = null
			account.passwordResetExpiresIn = null
			account.passwordResetToken = null
			await account.save()			

			return new Rebuke('Invalid operation. Token has expired.')
		}

		// Generate verification code
		const code = helpers.code()

		const resetDetail = {
			code,
			expires: futureDate(10, 'minutes'),
			token: cipher.encrypt(await argon2.hash(code))
		}

		// Log in dev mode
		helpers.log(resetDetail)

		account.passwordResetCode = cipher.encrypt(resetDetail.code)
		account.passwordResetExpiresIn = resetDetail.expires
		account.passwordResetToken = resetDetail.token
		const opStatus = await account.save()

		if (!opStatus?.id)
			return new Rebuke('Password reset code was not resent. Please try again.')

		// Notification service
		notificationsExchange.sendNotification({
			type: types.NotificationType.Email,
			email: {
				to: payload.email,
				message: `Please use the code '${resetDetail.code}' to reset your password.`,
				subject: 'Password Reset Code'
			}
		})

		return new Ok({
			message: 'Password reset code resent.',
			data: {
				token: resetDetail.token
			}
		})
	} catch(err) {
		return new Rebuke('Error while resending password reset code.')
	}
}

// Reset password
const resetPassword = async(body) => {
	try {
		const data = await jtoken.verify(body.signature)

		// Check signature
		if (!data)
			return new Rebuke('Invalid operation.')

		// Decrypt data
		const payload = cipher.encryptOrDecryptData(data, true)

		const condition = {
			email: cipher.encrypt(payload.email),
			passwordResetToken: payload.token
		}

		const account = await User.findOne(condition)
		
		if (!account)
			return new Rebuke('Invalid operation.')

		// Check if operation has not expired
		if (futureDate.isTimeBeforeNow(account.passwordResetExpiresIn)) {
			account.passwordResetCode = null
			account.passwordResetExpiresIn = null
			account.passwordResetToken = null
			await account.save()			

			return new Rebuke('Invalid operation. Token has expired.')
		}

		account.password = await argon2.hash(payload.password)
		account.passwordResetCode = null
		account.passwordResetExpiresIn = null
		account.passwordResetToken = null
		const opStatus = await account.save()

		if (!opStatus?.id)
			return new Rebuke('Password could not be reset. Please try again.')

		// Notification service
		notificationsExchange.sendNotification({
			type: types.NotificationType.Email,
			email: {
				to: payload.email,
				message: `Password to your account has been successfully changed.`,
				subject: 'Password Changed'
			}
		})

		return new Ok('Password reset successful.')
	} catch(err) {
		return new Rebuke('Error while reseting password.')
	}
}

module.exports = {
	userRegistration,
	verifyEmailAddress,
	resendVerificationCode,
	signUserIn,
	generatePasswordResetCode,
	resendPasswordResetCode,
	resetPassword
}