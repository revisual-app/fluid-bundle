var usedApps = [];
var accountInfo = {};

var userInfo = {};

let dcTippy;
let churchbeeTippy;
let ccbchimpTippy;
let hasSubscription = false;

const consentCheckbox = document.getElementById('refund-consent');
const checkoutBtn = document.getElementById('checkout-btn');

// Parse URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const preselectedApp = urlParams.get('app'); // Expected values: 'dc', 'ccbchimp', 'cb'

// Apply preselected app logic
(function() {
  if (preselectedApp) {
    // Auto-select CCB/Pushpay integration
    usedApps.push('ccb');

    // Change header logo based on preselected app
    const headerLogo = qs('.header-logo');
    if (headerLogo) {
      const logoMap = {
        'dc': '/img/displaychurch-logo.png',
        'cb': '/img/churchbee-logo.svg',
        'ccbchimp': '/img/ccbchimp-logo.png'
      };
      if (logoMap[preselectedApp]) {
        headerLogo.src = logoMap[preselectedApp];
        console.log('Changed header logo to:', logoMap[preselectedApp]);
      }
    }
    
    // Hide the app selection stage
    byId('apps').style.display = 'none';
    
    // Show the CCB form directly
    byId('pushpayform').style.display = 'flex';
    byId('pushpayform-subtitle').style.display = 'none'; // Hide subtitle since we're skipping app selection
    
    // Hide back to integrations button
    qs('#pushpayform .back-to-integrations').style.display = 'none';
  }
})();

(function () {
  // Don't initialize tippy tooltips if an app is preselected
  if (preselectedApp) {
    return;
  }

  const tip0 = tippy('#bundle_dc', {
    content: '<div style="">'
            +'        <div style="display: -webkit-inline-box; color: black; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 32px; word-wrap: break-word">'
                +'    <svg style="position: relative;    top: 2px;    left: -7px;" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">'
                +'    <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#4F7A21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>'
                +'    </svg>'
                +'Select Display Church for 22&cent;/day more.</div>'
    +'<div style="padding-left: 2px; padding-right: 2px; margin-left: 30px; display: flex">'
  +'    <div data-hierarchy="Primary" data-icon-only="False" data-loading-text="true" data-size="sm" data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="false" style="padding-left: 12px; padding-right: 12px; padding-top: 8px; padding-bottom: 8px; background: #4F7A21; box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05); overflow: hidden; border-radius: 8px; outline-offset: -2px; justify-content: center; align-items: center; gap: 4px; display: flex">'
                +'        <div style="padding-left: 2px; padding-right: 2px; justify-content: center; align-items: center; display: flex">'
                +'            <div onclick="selectDisplayChurch()" style="color: white; font-size: 14px; font-family: Inter; font-weight: 600; line-height: 20px; word-wrap: break-word">Select Display Church</div>'
                +'        </div>'
                +'    </div>'
                                +'</div>',
    allowHTML: true,
      placement: 'top', // 👈 this is the key
        appendTo: document.body, // optional, prevents positioning glitches

    interactive: true,
    hideOnClick: false,   // prevent auto-hide when clicking inside
    theme: 'custom-width', // add a custom theme name
    trigger: 'manual', // disables automatic hover/focus triggers
  });

  // Access the instance
  dcTippy = tip0[0];


  const tip1 = tippy('#bundle_cb', {
    content: '<div style="">'
            +'        <div style="display: -webkit-inline-box; color: black; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 32px; word-wrap: break-word">'
                +'    <svg style="position: relative;    top: 2px;    left: -7px;" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">'
                +'    <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#4F7A21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>'
                +'    </svg>'
                +'Select Churchbee for 60&cent;/day more.</div>'
    +'<div style="padding-left: 2px; padding-right: 2px; margin-left: 30px; display: flex">'
  +'    <div data-hierarchy="Primary" data-icon-only="False" data-loading-text="true" data-size="sm" data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="false" style="padding-left: 12px; padding-right: 12px; padding-top: 8px; padding-bottom: 8px; background: #4F7A21; box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05); overflow: hidden; border-radius: 8px; outline-offset: -2px; justify-content: center; align-items: center; gap: 4px; display: flex">'
                +'        <div style="padding-left: 2px; padding-right: 2px; justify-content: center; align-items: center; display: flex">'
                +'            <div onclick="selectChurchbee()" style="color: white; font-size: 14px; font-family: Inter; font-weight: 600; line-height: 20px; word-wrap: break-word">Select ChurchBee</div>'
                +'        </div>'
                +'    </div>'
                                +'</div>',
    allowHTML: true,
      placement: 'top', // 👈 this is the key
        appendTo: document.body, // optional, prevents positioning glitches

    interactive: true,
    hideOnClick: false,   // prevent auto-hide when clicking inside
    theme: 'custom-width', // add a custom theme name
    trigger: 'manual', // disables automatic hover/focus triggers
  });

  // Access the instance
  churchbeeTippy = tip1[0];

  const tip2 = tippy('#bundle_ccbchimp', {
    content: '<div style="">'
            +'        <div style="margin-left: -80px; display: -webkit-inline-box; color: black; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 32px; word-wrap: break-word">'
                +'    <svg style="position: relative;    top: 2px;    left: -7px;" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">'
                +'    <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#4F7A21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>'
                +'    </svg>'
                +'Select CCB Chimp for free.</div>'
    +'<div style="padding-left: 2px; padding-right: 2px; margin-left: 30px; display: flex">'
  +'    <div data-hierarchy="Primary" data-icon-only="False" data-loading-text="true" data-size="sm" data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="false" style="padding-left: 12px; padding-right: 12px; padding-top: 8px; padding-bottom: 8px; background: #4F7A21; box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05); overflow: hidden; border-radius: 8px; outline-offset: -2px; justify-content: center; align-items: center; gap: 4px; display: flex">'
                +'        <div style="padding-left: 2px; padding-right: 2px; justify-content: center; align-items: center; display: flex">'
                +'            <div onclick="selectCcb()" style="color: white; font-size: 14px; font-family: Inter; font-weight: 600; line-height: 20px; word-wrap: break-word">Select CCBChimp</div>'
                +'        </div>'
                +'    </div>'
                                +'</div>',
    allowHTML: true,
      placement: 'top', // 👈 this is the key
        appendTo: document.body, // optional, prevents positioning glitches

    interactive: true,
    hideOnClick: false,   // prevent auto-hide when clicking inside
    theme: 'custom-width', // add a custom theme name
    trigger: 'manual', // disables automatic hover/focus triggers
  });

  // Access the instance
  ccbchimpTippy = tip2[0];
})();

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

  document.getElementById('signup-for-updates-form').addEventListener('submit', function (event) {
    event.preventDefault();
    // event.preventDefault();
    onSubmitSingupForUpdates();
  });

  /** stage ccb account continue */
  document.getElementById('pushpay-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    byId('checkout-btn').removeEventListener('click', onCheckoutButtonClick);
    const $name = byId('ccb-name');
    const $email = byId('ccb-email');
    const $ccbAccount = byId('ccb-account');
    const $submit = byId('sumbit-pushpay');
    const $loader = byId('pushpayform-loader');

    byId('active-plans').classList.add('hide');

    document.querySelector('.ccb-account-error').style.display = 'none';
    $ccbAccount.classList.remove('input-error');

    $name.disabled = true;
    $email.disabled = true;
    $ccbAccount.disabled = true;
    $submit.disabled = true;

    $submit.style.display = 'none';
    $loader.style.display = 'inline-block';
    let ccbAccount = $ccbAccount.value.replace(/^https?:\/\//, "").split('.')[0].trim();

    try {
      const isCCBAddressValid = await checkCCBAddress(ccbAccount);

      //console.log('isCCBAddressValid', isCCBAddressValid);
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
      return;
    }

    // Signup for notification on the background
    signupNotify($name.value, $email.value, false);

    try {
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

      // Handle hiding non-selected apps if app query param is present
      // This must be called BEFORE updateBundlePricing to ensure correct pricing
      handlePreselectedAppDisplay();

      updateBundlePricing();

      const discountItems = qsa('.card-summary .discount-item');

      if (discountItems) {
        discountItems.forEach(function (item, index) {
          item.remove();
        });
      }

      // Reset all bundle buttons to their default state
      Object.keys(DISPLAY_NAMES_MAPPING).forEach((key) => {
        const btn = qs('#bundle_' + key);
        if (btn) {
          qs('#bundle_' + key + ' .btn-table-cell-label').innerHTML = 'Selected';
          // Don't reset the preselected app's disabled state
          if (key !== preselectedApp) {
            btn.style.pointerEvents = '';
            btn.parentNode.style.filter = '';
          }
        }
      });

      const items = [];
      Object.keys(accountInfo).forEach((key) => {
        const app = accountInfo[key];

        if (!app) {
          return;
        }

        if (app.has_subscription) {
          hasSubscription = true;
          qs('#bundle_' + key + ' .btn-table-cell-label').innerHTML = 'Already in use';
          const btn = qs('#bundle_' + key);
          btn.style.pointerEvents = 'none';
          btn.parentNode.style.filter = 'grayscale(1)';

          items.push(DISPLAY_NAMES_MAPPING[key]);

          qs('.card-summary .card-content').insertAdjacentHTML(
            'beforeend',
            '<div class="discount-item"><span>' +
              DISPLAY_NAMES_MAPPING[key] +
              ' ' +
              app.subscription.plan_name +
              '</span> <span>$' +
              Number((app.current_credit || 0) / 100) +
              '</span></div>',
          );
          
          // If this is the preselected app, disable checkout button
          if (preselectedApp && key === preselectedApp) {
            const checkoutBtn = byId('checkout-btn');
            if (checkoutBtn) {
              checkoutBtn.disabled = true;
              checkoutBtn.classList.add('btn-disabled');
              checkoutBtn.title = 'You already have an active subscription for this app.';
            }
          }
        }
      });

      if(hasSubscription && !preselectedApp) {
        byId('header-tools-found').classList.remove('hide');
        byId('p-tools-found').classList.remove('hide');

        byId('header-tools-not-found').classList.add('hide');
        byId('p-tools-not-found').classList.add('hide');

        byId('active-plans').classList.remove('hide');
        byId('product-names').innerHTML = joinWithAnd(items);

      } else {
        byId('header-tools-found').classList.add('hide');
        byId('p-tools-found').classList.add('hide');

        byId('header-tools-not-found').classList.remove('hide');
        byId('p-tools-not-found').classList.remove('hide');
      }

      userInfo.email = $email.value;
      userInfo.name = $name.value;
      userInfo.ccbAccount = ccbAccount;

      const dateFormatter = new Intl.DateTimeFormat(navigator.languages, { year: 'numeric', month: 'long', day: 'numeric' });
      byId('next-payment-date').innerHTML = dateFormatter.format(new Date().setFullYear(new Date().getFullYear() + 1));

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

       if(dcTippy) {
        dcTippy?.hide();
        churchbeeTippy?.hide();
        ccbchimpTippy?.hide();

      }
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
    return false;
  }

  return false;
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
    const result = await signupNotify(name, email, true);

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
  console.log('onCheckoutButtonClick', SELECTED_PLAN);
  if (!SELECTED_PLAN) {
    return true;
  }
  if(consentCheckbox.checked === false) {
    return;
  }

  const link = await getStripeCheckoutUrl(SELECTED_PLAN.price.id, userInfo.email, userInfo.ccbAccount, userInfo.name);

  if (link) {
    window.location.href = link.url;
  }
}
async function signupNotify(name, email, isWaitlist) {
  const response = await fetch('/signup-notify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      name,
      integrations: usedApps,
      isWaitlist,
    }),
  });

  return await response.json();
}




function updateCheckoutState() {
  // Check if preselected app has an active subscription
  let hasPreselectedSubscription = false;
  if (preselectedApp && accountInfo[preselectedApp]?.has_subscription) {
    hasPreselectedSubscription = true;
  }
  
  const enabled = consentCheckbox.checked && !hasPreselectedSubscription;

  checkoutBtn.disabled = !enabled;
  checkoutBtn.classList.toggle('btn-disabled', !enabled);

  if (hasPreselectedSubscription) {
    checkoutBtn.title = 'You already have an active subscription for this app.';
  } else if (!consentCheckbox.checked) {
    checkoutBtn.title = 'Please agree to the refund policy to proceed.';
  } else {
    checkoutBtn.title = '';
  }
}

(function () {

  // initial state on load
  updateCheckoutState();

  // update when user toggles checkbox
  consentCheckbox.addEventListener('change', updateCheckoutState);

  document.getElementById('refund-policy-link').addEventListener('click', function (event) {
    qs('.modal').style.display = 'flex';
    document.body.classList.add('modal-open');
  });

  document.getElementById('modal-header-btn-close').addEventListener('click', function (event) {
    qs('.modal').style.display = 'none';
    document.body.classList.remove('modal-open');
  });

})();




function joinWithAnd(list) {
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  if (list.length === 2) return list.join(" and ");
  return list.slice(0, -1).join(", ") + " and " + list[list.length - 1];
}

function handlePreselectedAppDisplay() {
  if (!preselectedApp) {
    return;
  }
  
  // Hide elements based on which app is selected
  if (preselectedApp === 'dc') {
    // Hide cards-right (contains ccbchimp and cb)
    const cardsRight = qs('.cards-right');
    if (cardsRight) {
      cardsRight.style.display = 'none';
    }
    // Mark ccbchimp and cb as unchecked
    const ccbchimpBtn = qs('#bundle_ccbchimp');
    const cbBtn = qs('#bundle_cb');
    if (ccbchimpBtn) {
      ccbchimpBtn.classList.add('unchecked');
    }
    if (cbBtn) {
      cbBtn.classList.add('unchecked');
    }
  } else if (preselectedApp === 'cb') {
    // Hide col-left ccbchimp and card-left dc
    const ccbchimpCol = qs('.col-left.ccbchimp');
    const cardLeft = qs('.card-left.dc');
    if (ccbchimpCol) {
      ccbchimpCol.style.display = 'none';
    }
    if (cardLeft) {
      cardLeft.style.display = 'none';
    }
    // Hide featured-icon-locked for cb
    const featuredIconLocked = qs('.featured-icon-locked');
    if (featuredIconLocked) {
      featuredIconLocked.style.display = 'none';
    }
    // Mark ccbchimp and dc as unchecked
    const ccbchimpBtn = qs('#bundle_ccbchimp');
    const dcBtn = qs('#bundle_dc');
    if (ccbchimpBtn) {
      ccbchimpBtn.classList.add('unchecked');
    }
    if (dcBtn) {
      dcBtn.classList.add('unchecked');
    }
  } else if (preselectedApp === 'ccbchimp') {
    // Hide col-right cb and card-left dc
    const cbCol = qs('.col-right.cb');
    const cardLeft = qs('.card-left.dc');
    if (cbCol) {
      cbCol.style.display = 'none';
    }
    if (cardLeft) {
      cardLeft.style.display = 'none';
    }
    // Hide featured-icon-locked for ccbchimp
    const featuredIconLocked = qs('.featured-icon-locked');
    if (featuredIconLocked) {
      featuredIconLocked.style.display = 'none';
    }
    // Mark cb and dc as unchecked
    const cbBtn = qs('#bundle_cb');
    const dcBtn = qs('#bundle_dc');
    if (cbBtn) {
      cbBtn.classList.add('unchecked');
    }
    if (dcBtn) {
      dcBtn.classList.add('unchecked');
    }
  }
  
  // Ensure the preselected app button is checked and disable it
  const btn = qs('#bundle_' + preselectedApp);
  if (btn) {
    btn.classList.remove('unchecked');
    btn.style.pointerEvents = 'none';
  }
  
  // Unlock cards-right to show pricing if needed (for cb or ccbchimp selection)
  if (preselectedApp === 'cb' || preselectedApp === 'ccbchimp') {
    const cardsRight = qs('.cards-right');
    if (cardsRight) {
      cardsRight.classList.add('unlocked');
    }
  }
  
  // Also hide the merged table cell that shows combined pricing
  const mergedCells = qsa('.table-cell-merged');
  mergedCells.forEach(cell => {
    cell.style.display = 'none';
  });
}
