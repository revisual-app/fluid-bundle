import {getAccountInfo as dc_accountInfo} from "./../apps/dc/accountInfo"
export async function getInfo(request) {

	if (request.method === 'POST') {

		// console.log('Handling POST request');
		const body = await request.json();
		const {email, ccb_account} = body;

		const dc = await dc_accountInfo(email, ccb_account);

		console.log(dc);
		return dc;
	}

	return null;
}
