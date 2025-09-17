var usedApps = [];
var accountInfo = {};

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

  /** stage no ccb continue */
  byId('signup-for-updates').addEventListener('click', function (event) {
    byId('signup-for-updates-form').submit();
  });

  byId('signup-for-updates-form').addEventListener('submit', function (event) {
    // event.preventDefault();
    onSubmitSingupForUpdates();
  });

  byId('sumbit-pushpay').addEventListener('click', async function (event) {
    byId('pushpay-form').submit();
  });
  /** stage ccb account continue */
  byId('pushpay-form').addEventListener('submit', async function (event) {
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
    });
  });
})();

async function checkCCBAddress(address) {
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
}

async function onSubmitSingupForUpdates() {
  // ...

  const $email = byId('email-for-updates');
  const $name = byId('name-for-updates');
  const $submit = byId('signup-for-updates');

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

    return await response.json();
  } catch (e) {
    // show error
    console.log(e);
  } finally {
    // ...
    console.log('hide loader');
    byId('apps-unsupported').style.display = 'none';
    byId('apps-unsupported-thankyou').style.display = 'flex';
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
