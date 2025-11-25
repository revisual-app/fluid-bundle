import { addCustomerBalance } from '../apps/stripe/addCustomerBalance';
import { getCoupon } from '../apps/stripe/getCoupon';
import { getCheckoutSession } from '../apps/stripe/getCheckoutSession';
import { updateCheckoutSession } from '../apps/stripe/updateCheckoutSession';
import { getCustomer } from '../apps/stripe/getCustomer';
import { addSubscriber, updateSubscriberTags } from '../apps/mailchimp/addToList';

export async function stripeWebhook(request) {
  if (request.method !== 'POST') {
    return { success: false, error: 'Method not allowed' };
  }

  try {
    const event = await request.json();

    // Handle only checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutSessionCompleted(event.data.object);
      return { success: true, received: true };
    }

    // Handle customer.subscription.updated event
    if (event.type === 'customer.subscription.updated') {
      await handleSubscriptionUpdated(event.data.object);
      return { success: true, received: true };
    }

    // Ignore other event types
    console.log(`Ignoring event type: ${event.type}`);
    return { success: true, received: true };
  } catch (err) {
    console.error('Webhook error:', err.message);
    return { success: false, error: 'Invalid webhook payload' };
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', {
    id: session.id,
    customer: session.customer,
    email: session.customer_email || session.client_reference_id,
    subscription: session.subscription,
    amount_total: session.amount_total,
    amount_subtotal: session.amount_subtotal,
    total_details: session.total_details,
    metadata: session.metadata,
    discounts: session.discounts,
  });

  const email = session.customer_email || session.client_reference_id;
  const subscriptionId = session.subscription;
  const metadata = session.metadata || {};

  const amountPaid = session.amount_total || 0;
  
  if (amountPaid === 0 && session.discounts && session.discounts.length > 0) {
    // Get the original price (subtotal before discounts)
    const originalPrice = session.amount_subtotal || 0;
    
    // Calculate total coupon value from all discounts
    let totalCouponValue = 0;
    
    for (const discount of session.discounts) {
      const couponId = discount.coupon;
      
      if (couponId) {
        const coupon = await getCoupon(couponId);
        
        if (coupon) {
          // Handle amount-based coupons (amount_off is in cents)
          if (coupon.amount_off) {
            totalCouponValue += coupon.amount_off;
          }
        }
      }
    }
    
    console.log('Zero payment detected:', {
      originalPrice,
      amountPaid,
      totalCouponValue,
      discounts: session.discounts,
    });
    
    // If the coupon value exceeds the original price
    if (totalCouponValue > 0 && totalCouponValue > originalPrice) {
      // Refetch the checkout session to get the latest metadata
      const latestSession = await getCheckoutSession(session.id);
      
      if (!latestSession) {
        console.error('Failed to fetch latest checkout session');
        return;
      }
      
      // Check if invoice balance has already been updated
      const invoiceBalanceUpdated = latestSession.metadata?.invoice_balance_updated == 1;
      
      if (invoiceBalanceUpdated) {
        console.log('Invoice balance already updated, skipping duplicate update:', {
          sessionId: session.id,
          customerId: session.customer,
        });
        return;
      }
      
      const exceedingAmount = totalCouponValue - originalPrice;
      
      console.log('Coupon exceeds purchase price:', {
        exceedingAmount,
        exceedingAmountInDollars: exceedingAmount / 100,
        email,
        subscriptionId,
        customerId: session.customer,
      });
      
      // Add the exceeding amount to the customer's Stripe balance
      if (session.customer) {
        const balanceResult = await addCustomerBalance(
          session.customer,
          exceedingAmount,
          `Credit from excess coupon value ($${(exceedingAmount / 100).toFixed(2)})`
        );
        
        if (balanceResult) {
          // Mark the session metadata to prevent duplicate processing
          await updateCheckoutSession(session.id, {
            ...latestSession.metadata,
            invoice_balance_updated: 1,
          });
          
          console.log('Invoice balance updated and session marked as processed');
        } else {
          console.error('Failed to add customer balance, not marking session as processed');
        }
      } else {
        console.error('No customer ID available to add balance');
      }
    }
  }

  // Provision access to your product and activate integrations
  
  if (metadata.dc_org_id) {
    console.log('Activating Display Church integration for org:', metadata.dc_org_id);
    // Activate Display Church integration
  }

  if (metadata.ccb_account_name) {
    console.log('Activating CCB integration for account:', metadata.ccb_account_name);
    // Activate CCB integration
  }

  // Add subscriber to Mailchimp with 'purchased_Bundle' tag
  if (email) {
    try {
      const customerName = session.customer_details?.name || '';
      await addSubscriber(email, customerName, ['purchased_Bundle']);
      console.log('Added subscriber to Mailchimp with purchased_Bundle tag:', email);
    } catch (error) {
      console.error('Failed to add subscriber to Mailchimp:', error);
    }
  }

  console.log('Checkout session processing completed for:', email);
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', {
    id: subscription.id,
    customer: subscription.customer,
    status: subscription.status,
    metadata: subscription.metadata,
  });

  // Handle subscription status changes
  if (subscription.status === 'canceled' || subscription.status === 'active') {
    const customerId = subscription.customer;
    
    // Fetch customer data from Stripe to get email
    const customer = await getCustomer(customerId);
    
    if (!customer) {
      console.error('Failed to fetch customer data for:', customerId);
      return;
    }
    
    const email = customer.email;
    const customerName = customer.name || '';
    
    if (email) {
      try {
        if (subscription.status === 'canceled') {
          await updateSubscriberTags(email, customerName, ['cancelled_Bundle'], ['purchased_Bundle']);
          console.log('Updated Mailchimp tags for canceled subscription:', email);
        } else if (subscription.status === 'active') {
          await updateSubscriberTags(email, customerName, ['purchased_Bundle'], ['cancelled_Bundle']);
          console.log('Updated Mailchimp tags for active subscription:', email);
        }
      } catch (error) {
        console.error('Failed to update Mailchimp tags:', error);
      }
    } else {
      console.log('No email found for customer:', customerId);
    }
  }
}
