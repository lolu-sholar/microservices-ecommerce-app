const { cipher } = require('../utils')

module.exports = (schema, exempt) => {
	return (req, res, next) => {
		// Validate schema
		const { error } = schema.validate(cipher.encryptOrDecryptData(req.body, true, exempt))

		// Check for error
		if (error)
			return res.status(400).send(error.details[0].message)

		next()
	}
}