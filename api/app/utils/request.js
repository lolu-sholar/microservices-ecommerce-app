// Make request
const request = async(url, data, method, headers) => {
	const body = JSON.stringify(data)
	const contentLength = new TextEncoder().encode(body).length

	return fetch(url, {
		method: method,
		headers: { 
			...(headers ?? {}),
			"content-type": "application/json",
			...(data ? { "content-length": contentLength.toString() } : {})
		},
		body
	})
}

// GET request
exports.get = async(url, headers) => {
	return request(url, undefined, 'GET', headers)
}

// POST request
exports.post = async(url, data, headers) => {
	return request(url, data, 'POST', headers)
}

// PUT request
exports.put = async(url, data, headers) => {
	return request(url, data, 'PUT', headers)
}

// DELETE request
exports.delete = async(url, headers) => {
	return request(url, undefined, 'DELETE', headers)
}

// Substitute request parameter with value
exports.parametize = (url, params) => {
	url += '/'
	for (let p in params)
		url = url.replace(`\/:${p}\/`, `/${params[p]}/`)
	
	return url.substring(0, url.length - 1)
}