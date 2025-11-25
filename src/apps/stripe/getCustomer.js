import { getEnv } from '../../context';

/**
 * Get a Stripe customer
 * @param {string} customerId - The Stripe customer ID
 * @returns {Promise<Object|null>} The customer object or null
 */
export async function getCustomer(customerId) {
  const env = getEnv();

  try {
    const resp = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${env.STRIPE_API_KEY}`,
        accept: 'application/json',
      },
    });

    if (resp.ok) {
      const json = await resp.json();
      return json;
    }

    const errorText = await resp.text();
    console.error('Failed to get customer:', errorText);
    return null;
  } catch (e) {
    console.error('Error getting customer:', e);
    return null;
  }
}
