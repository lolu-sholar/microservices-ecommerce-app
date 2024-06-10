const mailer = require('../utils/mailer')

// Send mail
const sendMail = async(payload) => {
	try {
		// Send mail
		mailer.send({
			to: [payload.email.to],
			message: `<div>${payload.email.message}</div>`,
			subject: payload.email.subject
		})
	} catch(err) {
		return new Rebuke('Error while sending mail.')
	}
}

module.exports = {
	sendMail
}