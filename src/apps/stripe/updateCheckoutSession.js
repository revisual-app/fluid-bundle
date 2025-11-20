import { getEnv } from '../../context';

export async function updateCheckoutSession(sessionId, metadata) {
	const env = getEnv();

	// Build the form data for metadata
	const formData = new URLSearchParams();
	for (const [key, value] of Object.entries(metadata)) {
		formData.append(`metadata[${key}]`, value);
	}

	try {
		const resp = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${env.STRIPE_API_KEY}`,
				accept: 'application/json',
			},
			body: formData.toString(),
		});

		if (resp.ok) {
			const json = await resp.json();
			return json;
		} else {
			console.error('Failed to update checkout session:', await resp.text());
			return null;
		}
	} catch (e) {
		console.error('Error updating checkout session:', e);
		return null;
	}
}
