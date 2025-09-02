import {getToken} from "./endpoints/getToken";

export default {
	async fetch(request, env, ctx) {
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: corsHeaders(),
			});
		}

		const url = new URL(request.url);

		try {

			let response = null;
			switch (url.pathname) {
				case '/get-token':
					//...
					response = getToken(request, env, ctx);
					break;

				default:
					return new Response('Not Found', {status: 404});
			}

			return new Response(JSON.stringify(response), {
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders(),
				},
			});
		} catch (err) {
			console.error(err);
			return new Response(JSON.stringify({success: false, error: err.message}), {
				status: 400,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders(),
				},
			});
		}


	},
};

function corsHeaders() {
	return {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
	};
}
