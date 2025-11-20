export async function loginApp(request, appName) {
  const env = await import('../context').then(m => m.getEnv());
  
  let redirectUrl;
  
  switch (appName) {
    case 'stripe-portal':
      redirectUrl = env.STRIPE_CUSTOMER_PORTAL;
      break;
    case 'displaychurch':
      redirectUrl = env.DC_API_ADDRESS;
      break;
    case 'ccbchimp':
      redirectUrl = env.CCBCHIMP_API_ADDRESS;
      break;
    case 'churchbee':
      redirectUrl = env.CB_API_ADDRESS;
      break;
    default:
      return { success: false, error: 'Unknown app' };
  }
  
  return {
    success: true,
    redirectUrl,
  };
}
