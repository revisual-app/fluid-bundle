import { getEnv } from '../../context';

export async function getPrices() {
	const env = getEnv();

	try {
		const resp = await fetch(`https://api.stripe.com/v1/prices?active=true&type=recurring`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${env.STRIPE_API_KEY}`,
				accept: 'application/json',
			},
		});

		if (resp.ok) {
			const json = await resp.json();

			return json.data;
		}
	} catch (e) {
		console.error(e);
		return null;
	}

	return null;
}
