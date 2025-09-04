import { init, getEnv } from './context';

import { getInfo } from './endpoints/getInfo';
import { listPlans } from './endpoints/listPlans';

export default {
	async fetch(request, env, ctx) {
		init(env);

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
				case '/get-info':
					//...
					response = await getInfo(request);
					break;

				case '/list-plans':
					//...
					response = await listPlans(request);
					break;

				default:
					return new Response('Not Found', { status: 404 });
			}

			console.log('response', response);
			return new Response(JSON.stringify(response), {
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders(),
				},
			});
		} catch (err) {
			console.error(err);
			return new Response(JSON.stringify({ success: false, error: err.message }), {
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
