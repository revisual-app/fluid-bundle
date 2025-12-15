import { init, getEnv } from './context';

import { getInfo } from './endpoints/getInfo';
import { listPlans } from './endpoints/listPlans';
import { getCheckout } from './endpoints/getCheckout';
import { addToWaitlist } from './endpoints/addToWaitlist';
import { checkAddress } from './endpoints/checkAddress';
import { stripeWebhook } from './endpoints/stripeWebhook';
import { loginApp } from './endpoints/loginApp';
import { getConfig } from './endpoints/getConfig';

export default {
  async fetch(request, env, ctx) {
    init(env);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    const url = new URL(request.url);

    try {
      let response = null;
      let useCors = true;

      switch (url.pathname) {
        case '/webhook/stripe':
          useCors = false;
          response = await stripeWebhook(request);
          break;

        case '/get-config':
          response = await getConfig(request);
          break;

        case '/get-info':
          //...
          response = await getInfo(request);
          break;

        case '/list-plans':
          //...
          response = await listPlans(request);
          break;

        case '/get-checkout-url':
          //...
          response = await getCheckout(request);
          break;

        case '/signup-notify':
          response = await addToWaitlist(request);
          break;

        case '/check-ccb-address':
          response = await checkAddress(request);
          break;

        case '/login/displaychurch':
        case '/login/ccbchimp':
        case '/login/churchbee':
        case '/login/stripe-portal':
          const appName = url.pathname.split('/')[2];
          response = await loginApp(request, appName);
          if (response.success && response.redirectUrl) {
            return Response.redirect(response.redirectUrl, 302);
          }
          break;

        default:
          return new Response('Not Found', { status: 404 });
      }

      // console.log('response', response);

      return new Response(JSON.stringify(response), {
        headers: {
          'Content-Type': 'application/json',
          ...(useCors ? corsHeaders() : {}),
        },
      });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      });
    }
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
