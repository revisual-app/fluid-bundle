// navigation, hide navigation on menu item click

let v;
(function () {

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
          isWaitlist: true,
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
