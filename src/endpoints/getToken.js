import {appendToGoogleSheet} from "../appendToGoogleSheet";
import {sendConfirmationEmail} from "../sendConfirmationEmail";

export async function getToken(req, res) {

	if (request.method === 'POST') {

		// console.log('Handling POST request');
		const body = await request.json();
		const {name, email, phone_number, people_attending, eventParam} = body;

	}

	return null;
}
