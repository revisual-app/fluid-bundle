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

// check/uncheck bundle options
document.querySelectorAll('.btn-table-cell').forEach((btn) => {
	btn.addEventListener('click', function (event) {
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

		const item = document.querySelector('.btn-table-cell.unchecked');

		if (item) {
			console.log(item.id);
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
	});

	document.querySelectorAll('.plans-text button').forEach((btn) => {
		btn.addEventListener('click', function (event) {
			const id = btn.parentNode.id.split('-')[1];
			document.getElementById(id).click();
		});
	});
});
