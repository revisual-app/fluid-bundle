var PLANS = null;

async function getStripeCheckoutUrl(priceId, email, ccbAccount) {
	const response = await fetch('/get-checkout-url', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email,
			ccb_account: ccbAccount,
			price_id: priceId,
		}),
	});

	return await response.json();
}

async function getPlans() {
	const plans = await fetch('/list-plans', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	PLANS = await plans.json();

	renderPlans();
}

async function onGetAppsInfo(event) {
	event.preventDefault();

	getPlans();

	const response = await fetch('/get-info', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email,
			ccb_account: ccbAccountName,
		}),
	});
	return false;
}

(function app() {
	// document.getElementById('submitbtn').addEventListener('click', onGetAppsInfo);
	// document.getElementById('form').addEventListener('submit', onGetAppsInfo);
})();

function renderPlans() {
	const row = document.getElementById('plans');
	row.innerHTML = ''; // clear first
	for (const plan of PLANS) {
		const price = plan.price;
		const priceFormatted = (price.unit_amount / 100).toFixed(2);

		const cardHTML = `
          <div class="col-md-4 mb-4">
            <div class="card shadow-lg border-0 rounded-3 h-100">
              <div class="card-body text-center p-4 d-flex flex-column">
                <h5 class="card-title fw-bold mb-3">${plan.name}</h5>
                <h2 class="card-price fw-bold mb-4">
                  $${priceFormatted}<span class="fs-6 text-muted">/${price.recurring.interval}</span>
                </h2>
                <ul class="list-unstyled mb-4">
                </ul>
                <a href="#" class="btn btn-primary w-100 rounded-pill mt-auto selectPlan" id="${price.id}">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        `;

		row.insertAdjacentHTML('beforeend', cardHTML);

		const planButtons = document.querySelectorAll('.selectPlan');

		planButtons.forEach((button) => {
			button.addEventListener('click', onSelectPlanClick);
		});
	}
}

async function onSelectPlanClick(event) {
	event.preventDefault();
	const priceID = event.target.id;

	const email = document.getElementById('email').value;
	const ccbAccountName = document.getElementById('ccb_account_name').value;

	const url = await getStripeCheckoutUrl(priceID, email, ccbAccountName);

	console.log(url);
	window.open(url.url, '_newBundle');
	return false;
}
