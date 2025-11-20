import { getEnv } from '../../context';

/**
 * Add balance to a Stripe customer account
 * @param {string} customerId - The Stripe customer ID
 * @param {number} amount - The amount to add in cents (negative value adds credit)
 * @param {string} description - Description of the balance transaction
 * @returns {Promise<Object|null>} The balance transaction object or null
 */
export async function addCustomerBalance(customerId, amount, description = 'Credit from excess coupon value') {
  const env = getEnv();

  // Stripe customer balance uses negative values for credits
  const creditAmount = -Math.abs(amount);

  const body = new URLSearchParams({
    amount: creditAmount,
    currency: 'usd',
    description,
  }).toString();

  console.log('addCustomerBalance', { customerId, amount: creditAmount, description });

  try {
    const resp = await fetch(`https://api.stripe.com/v1/customers/${customerId}/balance_transactions`, {
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
      console.log('Customer balance added:', json);
      return json;
    }

    const errorText = await resp.text();
    console.error('Failed to add customer balance:', errorText);
    return null;
  } catch (e) {
    console.error('Error adding customer balance:', e);
    return null;
  }
}
