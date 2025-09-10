(function () {
	document.querySelectorAll('.radio-group-item').forEach(function (el) {
		el.addEventListener('click', function (event) {
			if (el.classList.contains('checked')) {
				el.classList.remove('checked');
			} else {
				el.classList.add('checked');
			}
		});
	});
})();
