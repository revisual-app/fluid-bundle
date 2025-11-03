var PLANS = [];

// base prices
var BP = {
  dc: {
    monthly: 29.17,
    yearly: 350,
  },
  ccbchimp: {
    monthly: 25.5,
    yearly: 306,
  },
  cb: {
    monthly: 41.67,
    yearly: 500,
  },
};

var SELECTED_PLAN = null;
var SELECTED_APPS = ['displaychurch', 'ccbchimp', 'churchbee'];

var bundleDiscounts = {
  ['ccbchimp,churchbee'] : {'discount' : 37.965, 'bundle_type' : 1},
  ['ccbchimp,displaychurch'] : {'discount' : 45, 'bundle_type' : 2},
  ['churchbee,displaychurch'] : {'discount' : 45, 'bundle_type' : 3},
  ['ccbchimp,churchbee,displaychurch'] : {'discount' : 50, 'bundle_type' : 4},
};

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

function byId(id) {
  return document.getElementById(id);
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

      // const plansCol = document.querySelector('.plans-col');
      // if (plansCol) {
      //   if (item) {
      //     plansCol.style.display = 'flex';

      //     document.querySelectorAll('.modern-screen-mockup-inner-shadow img').forEach((el) => {
      //       el.style.display = 'none';
      //     });
      //     document.querySelector('#mockup-' + item.id).style.display = 'block';

      //     document.querySelectorAll('.plans-col .plans-text').forEach((el) => {
      //       el.style.display = 'none';
      //     });

      //     const plansText = document.querySelector('#select-' + item.id);

      //     if (plansText) {
      //       plansText.style.display = 'flex';
      //     }
      //   } else {
      //     document.querySelector('.plans-col').style.display = 'none';
      //   }
      // }

      getMatchingBundleProduct();
    });

    document.querySelectorAll('.plans-text button').forEach((btn) => {
      btn.addEventListener('click', function (event) {
        const id = btn.parentNode.id.split('-')[1];
        document.getElementById(id).click();
      });
    });
  });

  getMatchingBundleProduct();
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

function selectDisplayChurch() {
  qsa('.btn-table-cell#bundle_dc').forEach((btn) => {
    //btn.classList.remove('unchecked');
    btn.click();
  });
  //getMatchingBundleProduct();
}
function selectChurchbee() {
  qsa('.btn-table-cell#bundle_cb').forEach((btn) => {
     //btn.classList.remove('unchecked');
     btn.click();
  });
  //getMatchingBundleProduct();
}
function selectCcb() {
  qsa('.btn-table-cell#bundle_ccbchimp').forEach((btn) => {
     //btn.classList.remove('unchecked');
     btn.click();
  });
  //getMatchingBundleProduct();
}
function selectAll() {
  qsa('.btn-table-cell.unchecked').forEach((btn) => {
     //btn.classList.remove('unchecked');
     btn.click();
  });
  //getMatchingBundleProduct();
}
function clickUnlink() {
  //alert('unlink clicked');

  qsa('.btn-table-cell.locking.unchecked').forEach((btn) => {
     //btn.classList.remove('unchecked');
     btn.click();
  });
}

const svgObject = document.getElementById('featured-icon-unlink');
  svgObject.addEventListener('load', function() {
    //alert('loaded');
    const svgDoc = svgObject.contentDocument; // access inner SVG document
    const shape = svgDoc.querySelector('svg'); // element inside SVG
    if (shape) {
      shape.addEventListener('click', () => {
        //alert('SVG clicked!');
        clickUnlink();
      });
    }
  });

function processUncheckedApps() {

  qsa('.btn-table-cell.unchecked').forEach((btn) => {
    let appId = btn.id.split('_')[1];
    console.log('unchecked', appId);

      qs('.'+appId+' .row-month p').style.display = 'none';
      qs('.'+appId+' .row-month h2').innerHTML = "$"+BP[appId].monthly+"/mth";

      qs('.'+appId+' .row-year .strikethrough').style.display = 'none';
      qs('.'+appId+' .row-year .text-bold').innerHTML = "$"+BP[appId].yearly+"/year";



  });

  qsa('.btn-table-cell:not(.unchecked)').forEach((btn) => {
      let appId = btn.id.split('_')[1];
      console.log('checked', appId);

        if(qsa('.btn-table-cell:not(.unchecked)').length === 1) {
           qs('.'+appId+' .row-month p').style.display = 'none';
          qs('.'+appId+' .row-month h2').innerHTML = "$"+BP[appId].monthly+"/mth";

          qs('.'+appId+' .row-year .strikethrough').style.display = 'none';
          qs('.'+appId+' .row-year .text-bold').innerHTML = "$"+BP[appId].yearly+"/year";
        } else{
          qs('.'+appId+' .row-month p').style.display = 'block';
          qs('.'+appId+' .row-month h2').innerHTML = '-';

          qs('.'+appId+' .row-year .strikethrough').style.display = 'block';
          qs('.'+appId+' .row-year .text-bold').innerHTML = "-";
        }



  });

  if(SELECTED_PLAN) {
    //console.log(SELECTED_PLAN.metadata.apps);
    //console.log(bundleDiscounts[SELECTED_PLAN.metadata.apps]);

    var discountRate = bundleDiscounts[SELECTED_PLAN.metadata.apps].discount;
    var bundleType = bundleDiscounts[SELECTED_PLAN.metadata.apps].bundle_type;

    console.log('bundleType', bundleType);
    if(bundleType < 4) {
       qs('.bundle-banner.bundle-'+bundleType).classList.remove('hide');
    }

    var fullYearly = 0;
    qsa('.btn-table-cell:not(.unchecked)').forEach((btn) => {
      let appId = btn.id.split('_')[1];
      //console.log('checked', appId);

      var newMonthly = (BP[appId].monthly * (100 - discountRate) / 100).toFixed(2);
      var newYearly = (BP[appId].yearly * (100 - discountRate) / 100).toFixed(2);

      qs('.'+appId+' .row-month h2').innerHTML = "$"+newMonthly+"/mth";
      qs('.'+appId+' .row-year .text-bold').innerHTML = "$"+newYearly+"/year";


      fullYearly += BP[appId].yearly;
    });

    if(SELECTED_PLAN.metadata.apps  === 'churchbee,displaychurch'
      || SELECTED_PLAN.metadata.apps  === 'churchbee'
    ) {
      let appId = 'ccbchimp';


        qs('.'+appId+' .row-month p').style.display = 'block';
        qs('.'+appId+' .row-month h2').innerHTML = "Free";

        qs('.'+appId+' .row-year .strikethrough').style.display = 'block';
        qs('.'+appId+' .row-year .text-bold').innerHTML = "Free";

    }
    var fullPriceYearly = Number(SELECTED_PLAN.price.unit_amount / 100)
    var fullPriceMonthly = (fullPriceYearly / 12).toFixed(2)  ;

    if(qs('.monthly-saving')) {
      qs('.monthly-saving') .style.display = 'inline-block';
     qs('.yearly-saving') .style.display = 'inline-block';
    }
  if(qs('.bundle-save-base-price-monthly')) {
     qs('.bundle-save-base-price-monthly').innerHTML = ( (fullYearly / 12).toFixed(2) );
     qs('.bundle-save-base-price-yearly').innerHTML = ( fullYearly.toFixed(2)  );
}
  if(qs('.bundle-new-monthly-price')) {
     qs('.bundle-new-monthly-price').style.display = 'inline-block';
     qs('.bundle-new-yearly-price').style.display = 'inline-block';

     qs('.bundle-new-monthly-price').innerHTML = "$"+fullPriceMonthly+"/mth";
     qs('.bundle-new-yearly-price').innerHTML = "$"+fullPriceYearly+"/year";


    }

    if(qs('.discounted-ccbchimp-and-cb-price-monthly')) {
     if(bundleType === 4) {
       var yearly = BP['ccbchimp'].yearly  + BP['cb'].yearly;
       var newYearly = yearly * (100 - discountRate) / 100;
       qs('.discounted-ccbchimp-and-cb-price-monthly').innerHTML = '$'+(newYearly / 12).toFixed(2)+'/mth';
       qs('.discounted-ccbchimp-and-cb-price-yearly').innerHTML = '$'+newYearly+'/year';
     } else if(bundleType === 1) {
       qs('.discounted-ccbchimp-and-cb-price-monthly').innerHTML = '$'+(fullPriceYearly / 12).toFixed(2)+'/mth';
       qs('.discounted-ccbchimp-and-cb-price-yearly').innerHTML = '$'+fullPriceYearly+'/year';
     }
    }


  } else if( qsa('.btn-table-cell:not(.unchecked)').length === 1 ) {

    qsa('.btn-table-cell:not(.unchecked)').forEach((btn) => {
      let appId = btn.id.split('_')[1];
      if(qs('.monthly-saving')) {
       qs('.monthly-saving') .style.display = 'none';
       qs('.yearly-saving') .style.display = 'none';
      }
      if(qs('.discounted-ccbchimp-and-cb-price-monthly')) {
       qs('.discounted-ccbchimp-and-cb-price-monthly').innerHTML = '$'+(BP[appId].yearly / 12).toFixed(2)+'/mth';
       qs('.discounted-ccbchimp-and-cb-price-yearly').innerHTML = '$'+BP[appId].yearly+'/year';
      }

      if(appId == 'cb') {
        let appId1 = 'ccbchimp';


        qs('.'+appId1+' .row-month p').style.display = 'block';
        qs('.'+appId1+' .row-month h2').innerHTML = "Free";

        qs('.'+appId1+' .row-year .strikethrough').style.display = 'block';
        qs('.'+appId1+' .row-year .text-bold').innerHTML = "Free";
      }
    });
  }

  if( qsa('.btn-table-cell:not(.unchecked)').length === 1 ) {

    qsa('.btn-table-cell:not(.unchecked)').forEach((btn) => {
      let appId = btn.id.split('_')[1];
      if(appId == 'cb') {
        qs('.bundle-banner.churchbee-only').classList.remove('hide');
      } else if(appId == 'dc') {
        qs('.bundle-banner.dc-only').classList.remove('hide');
      } else if(appId == 'ccbchimp') {
        qs('.bundle-banner.ccb-only').classList.remove('hide');
      }
    });
  }

}

function getMatchingBundleProduct() {

  qsa('.bundle-banner').forEach((div) => {
   div.classList.add('hide');
  });

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

  processUncheckedApps();

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
        refunds += Number((app.current_credit || 0) / 100);
      }
    });
  }

  if (SELECTED_PLAN) {
    let bundlePrice = Number(SELECTED_PLAN.price.unit_amount / 100);
    let promotions = subtotal - bundlePrice;

    bundlePrice -= refunds;
    if (bundlePrice <= 0) {
      qs('#grand-total .value').innerHTML = 0;
      qs('.credit-on-file').style.display = 'block';
      byId('credit-on-file-value').innerHTML = -1 * bundlePrice;
      qs('.card-summary-row-base-rate').style.display = 'flex';
      qs('#base-rate .value').innerHTML = Number(SELECTED_PLAN.price.unit_amount / 100);
    } else {
      qs('#grand-total .value').innerHTML = bundlePrice;
      qs('.credit-on-file').style.display = 'none';
      qs('.card-summary-row-base-rate').style.display = 'none';
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
