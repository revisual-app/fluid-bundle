import { getEnv } from '../../context';

export async function getPlans() {
	const env = getEnv();

	try {
		const resp = await fetch(`https://api.stripe.com/v1/products?active=true`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
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
