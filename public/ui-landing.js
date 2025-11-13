// navigation, hide navigation on menu item click

let v;
let dcTippy;
let churchbeeTippy;
let ccbchimpTippy;
let hasSubscription = false;

(function () {


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
                +'            <div onclick="selectChurchbee()" style="color: white; font-size: 14px; font-family: Inter; font-weight: 600; line-height: 20px; word-wrap: break-word">Select Display Church</div>'
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
                +'            <div onclick="selectCcb()" style="color: white; font-size: 14px; font-family: Inter; font-weight: 600; line-height: 20px; word-wrap: break-word">Select Display Church</div>'
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

   tippy('#prorated-credits', {
        content: 'If you already have a subscription for these products, you’ll receive a discount.',
                theme: 'white',        // 👈 use our custom white theme

      });
    v = tippy('#tooltip-displaychurch', {
      content: '<div style=" margin: 15px; margin-left: 0px;"><img src="/img/displaychurch-logo.png"></div><div style="text-align: left;">DisplayChurch transforms your calendar and group data into beautifully designed components you can embed, share, or link. No manual updates needed.</div><br><div data-hierarchy="Link color" data-icon-only="False" data-loading-text="true" data-size="sm" data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="false" style="overflow: hidden; justify-content: center; align-items: center; gap: 4px; "><div style="color: #3F621A; font-size: 14px; font-family: Inter; font-weight: 600; text-decoration: underline; line-height: 20px; word-wrap: break-word; text-align: left; cursor: pointer;" onclick="window.location.href=\'https://display.church\'" >Learn more</div></div>',
      allowHTML: true,
      theme: 'white',        // 👈 use our custom white theme
      interactive: true,
    });

      v = tippy('#tooltip-ccbchimp', {
      content: '<div style=" margin: 15px; margin-left: 0px;"><img src="/img/card-ccbchimp.png"></div><div style="text-align: left;">CCBchimp makes syncing your audience painless, so you can focus on building real connections through targeted email outreach.</div><br><div data-hierarchy="Link color" data-icon-only="False" data-loading-text="true" data-size="sm" data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="false" style="overflow: hidden; justify-content: center; align-items: center; gap: 4px; "><div style="color: #3F621A; font-size: 14px; font-family: Inter; font-weight: 600; text-decoration: underline; line-height: 20px; word-wrap: break-word; text-align: left; cursor: pointer;" onclick="window.location.href=\'https://ccbchimp.com\'">Learn more</div></div>',
      allowHTML: true,
      theme: 'white',        // 👈 use our custom white theme
      interactive: true,
    });

     v = tippy('#tooltip-churchbee', {
      content: '<div style=" margin: 15px; margin-left: 0px;"><img src="/img/card-churchbee.svg"></div><div style="text-align: left;">ChurchBee lives right where you already communicate, helping you design polished email campaigns effortlessly.</div><br><div data-hierarchy="Link color" data-icon-only="False" data-loading-text="true" data-size="sm" data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="false" style="overflow: hidden; justify-content: center; align-items: center; gap: 4px; "><div style="color: #3F621A; font-size: 14px; font-family: Inter; font-weight: 600; text-decoration: underline; line-height: 20px; word-wrap: break-word; text-align: left; cursor: pointer;" onclick="window.location.href=\'https://bee.church\'">Learn more</div></div>',
      allowHTML: true,
      theme: 'white',        // 👈 use our custom white theme
      interactive: true,
    });

  document.querySelectorAll('.nav-mobile-toggle a').forEach((link) => {
    link.addEventListener('click', function (event) {
      document.getElementById('nav-toggle').checked = false;
    });
  });

  // expand more features in products section
  document.querySelectorAll('.more-features').forEach((link) => {
    link.addEventListener('click', function (event) {
      // get link's child node "label" and set innerHTML to Hide Features
      //console.log(link.childNodes);
      if (document.getElementById(link.dataset.target).classList.contains('expanded')) {
        document.getElementById(link.dataset.target).classList.remove('expanded');
        link.childNodes[1].innerHTML = 'Show Features';
        link.childNodes[1].classList.add('show');

      } else {
        link.childNodes[1].innerHTML = 'Hide Features';
        document.getElementById(link.dataset.target).classList.add('expanded');
        link.childNodes[1].classList.remove('show');

        setTimeout(() => {
                window.location.href = '#' + link.dataset.target;
                        window.scrollBy(0, -250); // scrolls up slightly for spacing

        }, 10); // delay to let expansion animation finish

      }
    });
  });

  document.getElementById('confirmed-church-waitlist').addEventListener('click', function (event) {
    qs('.modal').style.display = 'flex';
    document.body.classList.add('modal-open');
  });

  document.getElementById('modal-header-btn-close').addEventListener('click', function (event) {
    qs('.modal').style.display = 'none';
    document.body.classList.remove('modal-open');
  });

  document.getElementById('confirmed-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const $name = byId('waitlist-name');
    const $email = byId('waitlist-email');
    const $submit = byId('waitlist-submit');

    $name.disabled = true;
    $email.disabled = true;
    $submit.style.display = 'none';
    qs('.lds-ellipsis').style.display = 'inline-block';

    try {
      const response = await fetch('/signup-notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: $email.value,
          name: $name.value,
          integrations: ['confirmedchurch'],
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error('Could not add contact to waitlist.');
      }

      byId('modal-header-btn-close').click();
      byId('signup-success').style.display = 'flex';

      setTimeout(function () {
        byId('signup-success').style.display = 'none';
      }, 5000);
    } catch (e) {
      // show error
      qs('.waitlist-error').style.display = 'block';
      console.log(e);
    } finally {
      $email.disabled = false;
      $name.disabled = false;

      $submit.style.display = 'flex';
      qs('.lds-ellipsis').style.display = 'none';
    }
  });
})();

function showBundleFeatures() {
  document.querySelector('.plans').classList.add('show-features');
  document.querySelector('.show-more-bundle-features').classList.remove('show');
  document.querySelector('.hide-more-bundle-features').classList.add('show');

}
function hideBundleFeatures() {
  document.querySelector('.plans').classList.remove('show-features');
  document.querySelector('.show-more-bundle-features').classList.add('show');
  document.querySelector('.hide-more-bundle-features').classList.remove('show');
}



document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.section.testimonial').forEach(initTestimonial);
});

function initTestimonial(root) {
  const items = Array.from(root.querySelectorAll('.testimonial-item'));
  let current = Math.max(0, items.findIndex(el => el.classList.contains('is-active')));
  if (current === -1) current = 0;

  // Build/normalize dots
  const dotsWrap = root.querySelector('.slides');
  if (!dotsWrap) return;

  // If dot count doesn't match, rebuild to match items
  if (dotsWrap.children.length !== items.length) {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < items.length; i++) {
      const d = document.createElement('button');
      d.className = 'dot';
      d.type = 'button';
      d.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dotsWrap.appendChild(d);
    }
  }

  const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

  function goTo(i) {
    current = (i + items.length) % items.length;

    items.forEach((el, idx) => {
      const active = idx === current;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-hidden', active ? 'false' : 'true');
      el.tabIndex = active ? 0 : -1;
    });

    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx === current);
      d.setAttribute('aria-selected', idx === current ? 'true' : 'false');
    });
  }

  // Hook up dot clicks
  dots.forEach((d, idx) => d.addEventListener('click', () => goTo(idx)));

  // Keyboard support (left/right)
  dotsWrap.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); dots[current].focus(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); dots[current].focus(); }
  });

  // Initial state
  goTo(current);

  // OPTIONAL: autoplay (uncomment to enable)
  // let timer = setInterval(() => goTo(current + 1), 6000);
  // root.addEventListener('mouseenter', () => clearInterval(timer));
  // root.addEventListener('mouseleave', () => timer = setInterval(() => goTo(current + 1), 6000));
}
