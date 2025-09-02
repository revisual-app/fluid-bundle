async function getAppsInfo(data) {

}


async function onGetAppsInfo(event) {

	event.preventDefault();
	const email = document.getElementById('email').value;
	const ccbAccountName = document.getElementById('ccb_account_name').value;

	const response =  await fetch('/get-info', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email,
			ccb_account: ccbAccountName
		}),
	});

	console.log(response)

	return false;
}

(function app() {

	document.getElementById('submitbtn').addEventListener('click', onGetAppsInfo);
	document.getElementById('form').addEventListener('submit', onGetAppsInfo);



})();
