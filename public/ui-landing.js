// navigation, hide navigation on menu item click
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
