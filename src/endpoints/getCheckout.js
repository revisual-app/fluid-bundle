import { getInfo } from './getInfo';
import { createCheckoutSession } from '../apps/stripe/createCheckoutSession';
import { createDiscount } from '../apps/stripe/createDiscount';

export async function getCheckout(request) {
	if (request.method === 'POST') {
		const body = await request.clone().json();
		const appsInfo = await getInfo(request);
		// const plans = await listPlans(request); // todo any validation?

		const { email, ccb_account, price_id } = body;

		const discountValue = getDiscountValue(appsInfo);
		let discount = null;

		if (discountValue) {
			discount = await createDiscount(discountValue);
			console.log(discount);
		}

		// add here any metadata you need
		let metadataIdx = 0;
		const metadata = [];

		if (appsInfo.dc && appsInfo.dc.has_account) {
			metadata.push([`metadata[dc_org_id]`, appsInfo.dc.account.org_id]);
		}

		const sessionData = {
			client_reference_id: email,
			customer_email: email,
			success_url: 'http://localhost:8787/success',
			cancel_url: 'http://localhost:8787/',
			'line_items[0][price]': price_id,
			'line_items[0][quantity]': 1,
			mode: 'subscription',
		};

		if (metadata.length) {
			for (const item of metadata) {
				sessionData[item[0]] = item[1];
			}
		}

		if (discount) {
			sessionData['discount[coupon]'] = discount.id;
		}

		const checkoutSession = await createCheckoutSession(new URLSearchParams(sessionData).toString());

		return checkoutSession;
	}

	return null;
}

function getDiscountValue(appsInfo) {
	const currentTime = Math.floor(new Date().getTime() / 1000);

	return Object.values(appsInfo)
		.map((app, idx) => {
			if (!app) {
				return 0;
			}

			if (!app || !app.has_subscription) {
				return 0;
			}

			const subscriptionEnd = app.subscription.subscription_end;
			const timeLeft = subscriptionEnd - currentTime;

			const subscriptionPeriod = (app.subscription.is_monthly ? 30 : 365) * 24 * 60 * 60; // in seconds
			const subscriptionPrice = app.subscription.price;

			// credit left = price * time left / subscription period
			const creditLeft = (subscriptionPrice * timeLeft) / subscriptionPeriod;
			console.log('credit left for', idx, 'is', creditLeft);
		})
		.reduce((acc, current) => {
			return acc + current;
		}, 0);
}
