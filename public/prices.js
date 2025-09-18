var PLANS = [];
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
    monthly: 10,
    yearly: 100,
  },
};

var SELECTED_PLAN = null;
var SELECTED_APPS = ['displaychurch', 'ccbchimp', 'churchbee'];

var APPS_NAMES_MAPPING = {
  ['dc']: 'displaychurch',
  ['ccb']: 'ccbchimp',
  ['cb']: 'churchbee',
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

      if (item) {
        document.querySelector('.plans-col').style.display = 'flex';

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
  const plans = await fetch('/list-plans', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  PLANS = await plans.json();

  console.log('getPlans');
  getMatchingBundleProduct();
}

function getMatchingBundleProduct() {
  console.log('SELECTED_APPS', SELECTED_APPS);
  const result = PLANS.filter((obj) => {
    // turn apps string into array
    const apps = obj.metadata.apps.split(',').map((a) => a.trim());

    if (apps.length !== SELECTED_APPS.length) {
      return false;
    }
    // check if every required app is included
    return apps.every((app) => SELECTED_APPS.includes(app));
  });

  if (result.length > 0) {
    SELECTED_PLAN = result[0];
  } else {
    SELECTED_PLAN = null;
  }
  console.log(SELECTED_PLAN);
}

function updateBundlePricing() {}
