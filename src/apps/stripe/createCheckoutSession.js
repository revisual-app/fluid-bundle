export async function createCheckoutSession(data) {
	const resp = await fetch(`https://api.stripe.com/v1/checkout/sessions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.STRIPE_API_KEY}`,
			accept: 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (resp.ok) {
		const json = await resp.json();

		return json.data;
	}
}
