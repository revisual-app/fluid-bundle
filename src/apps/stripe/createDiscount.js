import { getEnv } from '../../context';

export async function createDiscount(amount) {
  const env = getEnv();

  const body = new URLSearchParams({
    amount_off: amount,
    currency: 'usd',
    name: 'Bundle purchase pro-rate discount',
    max_redemptions: 1,
  }).toString();

  console.log('createDiscount', body);

  try {
    const resp = await fetch(`https://api.stripe.com/v1/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${env.STRIPE_API_KEY}`,
        accept: 'application/json',
      },
      body,
    });

    if (resp.ok) {
      const json = await resp.json();
      return json;
    }
    console.log(await resp.text());
  } catch (e) {
    console.log('error: >>>');
    console.error(e);
  }
}
