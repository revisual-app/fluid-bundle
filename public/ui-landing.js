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
document.querySelectorAll('.btn-table-cell.locking').forEach((btn) => {
	btn.addEventListener('click', function (event) {
		if (btn.classList.contains('unchecked')) {
			btn.classList.remove('unchecked');
		} else {
			btn.classList.add('unchecked');
		}

		if (document.querySelectorAll('.btn-table-cell.locking.unchecked').length) {
			console.log('linking');
			document.querySelector('.cards-right').classList.add('unlocked');
		} else {
			console.log('unlinking');
			document.querySelector('.cards-right').classList.remove('unlocked');
		}
	});
});
