import { getPlans } from '../apps/stripe/getPlans';
import { getPrices } from '../apps/stripe/getPrices';

export async function listPlans(request) {
	const [plans, prices] = await Promise.all([getPlans(), getPrices()]);

	plans.map((plan) => {
		plan.price = prices.find((price) => price.id === plan.default_price) || 
		              prices.find((price) => price.product === plan.id);
	});

	return plans;
}
