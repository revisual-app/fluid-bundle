var PLANS = [];

// base prices
var BP = {
  dc: {
    monthly: 35,
    yearly: 350,
  },
  ccbchimp: {
    monthly: 30,
    yearly: 306,
  },
  cb: {
    monthly: 20,
    yearly: 200,
  },
};

var SELECTED_PLAN = null;
var SELECTED_APPS = ['displaychurch', 'ccbchimp', 'churchbee'];

var APPS_NAMES_MAPPING = {
  ['dc']: 'displaychurch',
  ['ccbchimp']: 'ccbchimp',
  ['cb']: 'churchbee',
};

var DISPLAY_NAMES_MAPPING = {
  ['dc']: 'DisplayChurch',
  ['ccbchimp']: 'CCBChimp',
  ['cb']: 'ChurchBee',
};

function qs(q) {
  return document.querySelector(q);
}

function qsa(q) {
  return document.querySelectorAll(q);
}

(function () {
  getPlans();

  const bpm = qs('.bundle-save-base-price-monthly');
  if (bpm) {
    bpm.innerHTML = BP.dc.monthly + BP.ccbchimp.monthly + BP.cb.monthly;
    qs('.bundle-save-base-price-yearly').innerHTML = BP.dc.yearly + BP.ccbchimp.yearly + BP.cb.yearly;
  }

  qs('.dc-price-monthly').innerHTML = BP.dc.monthly;
  qs('.dc-price-yearly').innerHTML = BP.dc.yearly;

  qs('.ccbchimp-price-monthly').innerHTML = BP.ccbchimp.monthly;
  qs('.ccbchimp-price-yearly').innerHTML = BP.ccbchimp.yearly;

  qs('.cb-price-monthly').innerHTML = BP.cb.monthly;
  qs('.cb-price-yearly').innerHTML = BP.cb.yearly;

  qs('.ccbchimp-and-cb-price-monthly').innerHTML = BP.cb.monthly + BP.ccbchimp.monthly;
  qs('.ccbchimp-and-cb-price-yearly').innerHTML = BP.cb.yearly + BP.ccbchimp.yearly;

  // check/uncheck bundle options
  document.querySelectorAll('.btn-table-cell').forEach((btn) => {
    btn.addEventListener('click', function (event) {
      SELECTED_APPS = [];
      if (btn.classList.contains('unchecked')) {
        btn.classList.remove('unchecked');
      } else {
        btn.classList.add('unchecked');
      }

      if (document.querySelectorAll('.btn-table-cell.locking.unchecked').length) {
        document.querySelector('.cards-right').classList.add('unlocked');
      } else {
        document.querySelector('.cards-right').classList.remove('unlocked');
      }

      qsa('.btn-table-cell:not(.unchecked)').forEach((btn) => {
        const appId = btn.id.split('_')[1];
        SELECTED_APPS.push(APPS_NAMES_MAPPING[appId]);
      });
      const item = document.querySelector('.btn-table-cell.unchecked');

      const plansCol = document.querySelector('.plans-col');
      if (plansCol) {
        if (item) {
          plansCol.style.display = 'flex';

          document.querySelectorAll('.modern-screen-mockup-inner-shadow img').forEach((el) => {
            el.style.display = 'none';
          });
          document.querySelector('#mockup-' + item.id).style.display = 'block';

          document.querySelectorAll('.plans-col .plans-text').forEach((el) => {
            el.style.display = 'none';
          });

          const plansText = document.querySelector('#select-' + item.id);

          if (plansText) {
            plansText.style.display = 'flex';
          }
        } else {
          document.querySelector('.plans-col').style.display = 'none';
        }
      }

      getMatchingBundleProduct();
    });

    document.querySelectorAll('.plans-text button').forEach((btn) => {
      btn.addEventListener('click', function (event) {
        const id = btn.parentNode.id.split('-')[1];
        document.getElementById(id).click();
      });
    });
  });
})();

async function getPlans() {
  try {
    const plans = await fetch('/list-plans', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    PLANS = await plans.json();

    console.log('getPlans');
    getMatchingBundleProduct();
  } catch (err) {
    console.error('getPlans failed', err);
  }
}

function getMatchingBundleProduct() {
  if (!PLANS) {
    return;
  }
  const result = PLANS.filter((obj) => {
    // turn apps string into array
    const apps = obj.metadata.apps.split(',').map((a) => a.trim());

    console.log(apps, SELECTED_APPS);
    if (apps.length !== SELECTED_APPS.length) {
      return false;
    }
    // check if every required app is included
    return apps.every((app) => SELECTED_APPS.includes(app));
  });

  console.log('result', result);
  if (result.length > 0) {
    SELECTED_PLAN = result[0];
  } else {
    SELECTED_PLAN = null;
  }

  updateBundlePricing();
}

function updateBundlePricing() {
  console.log('updateBundlePricing', SELECTED_PLAN);

  if (!qs('.stage-checkout')) {
    return;
  }

  let selectedApps = [];
  let subtotal = 0;
  qsa('.btn-table-cell:not(.unchecked)').forEach((btn) => {
    let appId = btn.id.split('_')[1];
    selectedApps.push(appId);

    subtotal += BP[appId].yearly;
  });

  const itemsNumber = selectedApps.length;
  qs('.card-summary-header-items .value').innerHTML = itemsNumber;
  qs('#subtotal-value .value').innerHTML = subtotal;

  let refunds = 0;

  if (accountInfo) {
    Object.keys(accountInfo).forEach((key) => {
      const app = accountInfo[key];

      if (!app) {
        return;
      }

      if (app.has_subscription) {
        refunds += Number(app.current_credit / 100);
      }
    });
  }

  if (SELECTED_PLAN) {
    let bundlePrice = Number(SELECTED_PLAN.price.unit_amount / 100);
    let promotions = subtotal - bundlePrice;

    bundlePrice -= refunds;
    if (bundlePrice <= 0) {
      qs('#grand-total .value').innerHTML = 0;
      qs('.credit-on-file').display = 'block';
      byId('credit-on-file-value').innerHTML = -1 * bundlePrice;
    } else {
      qs('#grand-total .value').innerHTML = bundlePrice;
      qs('.credit-on-file').display = 'none';
    }

    qs('#promotion-value .value').innerHTML = promotions;

    qs('#discount-value .value').innerHTML = refunds;

    byId('next-payment-quote').innerHTML = Number(SELECTED_PLAN.price.unit_amount / 100);

    byId('checkout-btn').disabled = false;
  } else {
    byId('checkout-btn').disabled = true;
  }
}

// checkout prices
document.querySelectorAll('.btn-table-cell').forEach((btn) => {
  btn.addEventListener('click', function (event) {
    updateBundlePricing();
  });
});
