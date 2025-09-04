import { getInfo } from './getInfo';
import { createCheckoutSession } from '../apps/stripe/createCheckoutSession';

export async function getCheckout(request) {
	if (request.method === 'POST') {
		const body = await request.clone().json();
		const appsInfo = await getInfo(request);
		// const plans = await listPlans(request); // todo any validation?

		const { email, ccb_account, price_id } = body;

		const discountValue = getDiscountValue(appsInfo);
		let discount = null;

		console.log(appsInfo);
		console.log('discount value', discountValue);
		if (discountValue) {
			discount = createDiscount(discountValue);
			console.log(discount);
		}

		// add here any metadata you need
		const metadata = [];

		if (appsInfo.dc && appsInfo.dc.has_account) {
			metadata.push({ dc_org_id: appsInfo.account.dc_org_id });
		} /*

		const checkoutSession = createCheckoutSession({
			client_reference_id: email,
			customer_email: email,
			line_items: [
				{
					price: price_id,
				},
			],
			metadata,
			discounts: discount ? { coupon: discount.id } : undefined,
		});

		return checkoutSession;*/
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
