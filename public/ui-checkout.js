var usedApps = [];

function byId(id) {
	return document.getElementById(id);
}

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
		}
	});

	/** back buttons */
	byId('back-to-integrations').addEventListener('click', function (event) {
		event.preventDefault();
		document.querySelectorAll('.stage-container').forEach(function (el) {
			el.style.display = 'none';
		});

		byId('apps').style.display = 'flex';
	});
})();
