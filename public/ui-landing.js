// navigation, hide navigation on menu item click

(function () {
  document.querySelectorAll('.nav-mobile-toggle a').forEach((link) => {
    link.addEventListener('click', function (event) {
      document.getElementById('nav-toggle').checked = false;
    });
  });

  // expand more features in products section
  document.querySelectorAll('.more-features').forEach((link) => {
    link.addEventListener('click', function (event) {
      // get link's child node "label" and set innerHTML to Hide Features
      console.log(link.childNodes);
      if (document.getElementById(link.dataset.target).classList.contains('expanded')) {
        document.getElementById(link.dataset.target).classList.remove('expanded');
        link.childNodes[1].innerHTML = 'Show Features';
        link.childNodes[1].classList.add('show');
      } else {
        link.childNodes[1].innerHTML = 'Hide Features';
        document.getElementById(link.dataset.target).classList.add('expanded');
        link.childNodes[1].classList.remove('show');
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
