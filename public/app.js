async function fetchStripeToken(data) {
	return await fetch('/get-token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
}


(function app() {

	const email = document.getElementById('email');

	const token = fetchStripeToken({
		email
	});
})();
