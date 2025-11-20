export function objectToURLQuery(params = {}) {
	return Object.keys(params)
		.filter((i) => params[i])
		.map((key) => key + '=' + (typeof params[key] === 'object' ? objectToURLQuery(params[key]) : encodeURIComponent(params[key])))
		.join('&');
}

// MD5 hash function for Cloudflare Workers (no Node.js crypto available)
export async function md5(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
