import { getEnv } from '../../context';

export async function createCheckoutSession(data) {
	const env = getEnv();

	const resp = await fetch(`https://api.stripe.com/v1/checkout/sessions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Bearer ${env.STRIPE_API_KEY}`,
			accept: 'application/json',
		},
		body: data,
	});

	if (resp.ok) {
		const json = await resp.json();

		return json;
	} else {
		console.error(await resp.text());
		return null;
	}
}
