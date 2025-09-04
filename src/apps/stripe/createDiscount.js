export async function createDiscount(amount) {
	const resp = await fetch(`https://api.stripe.comv1/coupons`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.STRIPE_API_KEY}`,
			accept: 'application/json',
		},
		body: JSON.stringify({
			amount_off: amount,
			name: 'Bundle purchase pro-rate discount',
			max_redemptions: 1,
		}),
	});

	if (resp.ok) {
		const json = await resp.json();

		return json.data;
	}
}
