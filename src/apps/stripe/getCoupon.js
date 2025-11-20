import { getEnv } from '../../context';

/**
 * Get coupon details from Stripe
 * @param {string} couponId - The Stripe coupon ID
 * @returns {Promise<Object|null>} The coupon object or null
 */
export async function getCoupon(couponId) {
  const env = getEnv();

  console.log('Fetching coupon:', couponId);

  try {
    const resp = await fetch(`https://api.stripe.com/v1/coupons/${couponId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${env.STRIPE_API_KEY}`,
        accept: 'application/json',
      },
    });

    if (resp.ok) {
      const json = await resp.json();
      console.log('Coupon details:', json);
      return json;
    }

    const errorText = await resp.text();
    console.error('Failed to fetch coupon:', errorText);
    return null;
  } catch (e) {
    console.error('Error fetching coupon:', e);
    return null;
  }
}
