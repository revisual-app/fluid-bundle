export function objectToURLQuery(params = {}) {
	return Object.keys(params)
		.filter((i) => params[i])
		.map((key) => key + '=' + (typeof params[key] === 'object' ? objectToURLQuery(params[key]) : encodeURIComponent(params[key])))
		.join('&');
}
