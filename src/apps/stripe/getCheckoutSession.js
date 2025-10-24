import { getEnv } from '../../context';

export async function getCheckoutSession(sessionId) {
	const env = getEnv();

	try {
		const resp = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${env.STRIPE_API_KEY}`,
				accept: 'application/json',
			},
		});

		if (resp.ok) {
			const json = await resp.json();
			return json;
		} else {
			console.error('Failed to fetch checkout session:', await resp.text());
			return null;
		}
	} catch (e) {
		console.error('Error fetching checkout session:', e);
		return null;
	}
}
