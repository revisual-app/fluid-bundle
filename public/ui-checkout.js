var usedApps = [];
var accountInfo = {};

var userInfo = {};
function byId(id) {
  return document.getElementById(id);
}

(function () {
  /** stage apps radio buttons*/
  document.querySelectorAll('.radio-group-item').forEach(function (el) {
    el.addEventListener('click', function (event) {
      if (el.classList.contains('checked')) {
        el.classList.remove('checked');
      } else {
        el.classList.add('checked');
      }
    });
  });

  /** stage apps continue */
  document.getElementById('apps-continue').addEventListener('click', function (event) {
    // ...
    usedApps.length = 0;
    document.querySelectorAll('.radio-group-item.checked').forEach(function (el) {
      usedApps.push(el.getAttribute('data-integration'));
    });

    byId('apps').style.display = 'none';

    if (!usedApps.includes('ccb')) {
      // show unsupported stage
      byId('apps-unsupported').style.display = 'flex';
    } else {
      // show ccb stage
      byId('pushpayform').style.display = 'flex';
      if (usedApps.length > 1) {
        byId('pushpayform-subtitle').style.display = 'block';
      } else {
        byId('pushpayform-subtitle').style.display = 'none';
      }
    }
  });

  byId('signup-for-updates-form').addEventListener('submit', function (event) {
    event.preventDefault();
    // event.preventDefault();
    onSubmitSingupForUpdates();
  });

  /** stage ccb account continue */
  byId('pushpay-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    byId('checkout-btn').removeEventListener('click', onCheckoutButtonClick);
    const $name = byId('ccb-name');
    const $email = byId('ccb-email');
    const $ccbAccount = byId('ccb-account');
    const $submit = byId('sumbit-pushpay');
    const $loader = byId('pushpayform-loader');

    document.querySelector('.ccb-account-error').style.display = 'none';
    $ccbAccount.classList.remove('input-error');

    $name.disabled = true;
    $email.disabled = true;
    $ccbAccount.disabled = true;
    $submit.disabled = true;

    $submit.style.display = 'none';
    $loader.style.display = 'inline-block';

    try {
      const isCCBAddressValid = await checkCCBAddress($ccbAccount.value);

      if (!isCCBAddressValid) {
        throw new Error('CCBAddress requires CCBAddress');
      }
    } catch (e) {
      console.log(e);
      $ccbAccount.classList.add('input-error');
      document.querySelector('.ccb-account-error').style.display = 'block';

      $name.disabled = false;
      $email.disabled = false;
      $ccbAccount.disabled = false;
      $submit.disabled = false;

      $submit.style.display = 'block';
      $loader.style.display = 'none';
    }

    try {
      const ccbAccount = $ccbAccount.value.split('.')[0].trim();
      accountInfo = await getAppsInfo($name.value, $email.value, ccbAccount);

      console.log(accountInfo);
    } catch (e) {
      console.log('apps info error', e);
    } finally {
      $name.disabled = false;
      $email.disabled = false;
      $ccbAccount.disabled = false;
      $submit.disabled = false;

      $submit.style.display = 'block';
      $loader.style.display = 'none';

      byId('pushpayform').style.display = 'none';
      byId('purchase').style.display = 'flex';

      byId('checkout-banner').classList.remove('show');
      byId('checkout-summary').classList.add('show');

      qs('.checkout-page').classList.add('stage-checkout');

      updateBundlePricing();

      const discountItems = qs('.card-summary-header-items .discount-item');

      if (discountItems) {
        discountItems.forEach(function (item, index) {
          item.remove();
        });
      }
      Object.keys(accountInfo).forEach((key) => {
        const app = accountInfo[key];

        if (!app) {
          return;
        }

        if (app.has_subscription) {
          qs('#bundle_' + key + ' .btn-table-cell-label').innerHTML = 'Already in use';
          const btn = qs('#bundle_' + key);
          btn.style.pointerEvents = 'none';
          btn.parentNode.style.filter = 'grayscale(1)';

          qs('.card-summary .card-content').insertAdjacentHTML(
            'beforeend',
            '<div class="discount-item"><span>' +
              DISPLAY_NAMES_MAPPING[key] +
              ' ' +
              app.subscription.plan_name +
              '</span> <span>$' +
              Number(app.current_credit / 100) +
              '</span></div>',
          );
        }
      });

      userInfo.email = $email.value;
      userInfo.name = $name.value;
      userInfo.ccnAccount = ccbAccount;

      const dateFormatter = new Intl.DateTimeFormat(navigator.languages, { year: 'numeric', month: 'long', day: 'numeric' });
      byId('next-payment-date').innerHTML = dateFormatter.format(new Date());

      byId('checkout-btn').addEventListener('click', onCheckoutButtonClick);
    }
  });

  /** back buttons */
  document.querySelectorAll('.back-to-integrations').forEach(function (el) {
    el.addEventListener('click', function (event) {
      event.preventDefault();
      document.querySelectorAll('.stage-container').forEach(function (el) {
        el.style.display = 'none';
      });

      byId('apps').style.display = 'flex';
    });
  });

  /** back buttons */
  document.querySelectorAll('.back-to-my-data').forEach(function (el) {
    el.addEventListener('click', function (event) {
      event.preventDefault();
      document.querySelectorAll('.stage-container').forEach(function (el) {
        el.style.display = 'none';
      });

      byId('pushpayform').style.display = 'flex';

      byId('checkout-banner').classList.add('show');
      byId('checkout-summary').classList.remove('show');

      qs('.checkout-page').classList.remove('stage-checkout');
    });
  });
})();

async function checkCCBAddress(address) {
  try {
    const response = await fetch('/check-ccb-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      return false;
    }

    const json = await response.json();
    return json.success;
  } catch (e) {
    console.error(e);
  }
}

async function onSubmitSingupForUpdates() {
  // ...

  const $email = byId('email-for-updates');
  const $name = byId('name-for-updates');
  const $submit = byId('signup-for-updates');

  qs('.waitlist-error').display = 'none';

  $email.disabled = true;
  $name.disabled = true;

  $submit.style.display = 'none';
  byId('signup-for-updates-loader').style.display = 'inline-block';

  const email = byId('email-for-updates').value;
  const name = byId('name-for-updates').value;

  try {
    const response = await fetch('/signup-notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        integrations: usedApps,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error('Could not add contact to waitlist.');
    }

    byId('apps-unsupported').style.display = 'none';
    byId('apps-unsupported-thankyou').style.display = 'flex';
  } catch (e) {
    // show error
    qs('.waitlist-error').style.display = 'block';
    console.log(e);
  } finally {
    $email.disabled = false;
    $name.disabled = false;

    $submit.style.display = 'flex';
    byId('signup-for-updates-loader').style.display = 'none';
  }
}

async function getAppsInfo(name, email, ccbAccountName) {
  const response = await fetch('/get-info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      ccb_account: ccbAccountName,
    }),
  });

  return await response.json();
}

async function getStripeCheckoutUrl(priceId, email, ccbAccount, name) {
  const response = await fetch('/get-checkout-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      name,
      ccb_account: ccbAccount,
      price_id: priceId,
    }),
  });

  return await response.json();
}

async function onCheckoutButtonClick(event) {
  console.log('on checkout click', SELECTED_PLAN);
  if (!SELECTED_PLAN) {
    return true;
  }

  const link = await getStripeCheckoutUrl(SELECTED_PLAN.price.id, userInfo.email, userInfo.ccnAccount, userInfo.name);

  if (link) {
    window.location.href = link.url;
  }
}
