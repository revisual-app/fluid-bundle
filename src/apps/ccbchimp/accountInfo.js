import { getEnv } from '../../context';
import { objectToURLQuery } from '../../helpers';

export async function getAccountInfo(email, ccbAccountName) {
	try {
		const env = getEnv();

		const paramsString = objectToURLQuery({
			email,
			ccb_account_name: ccbAccountName,
		});

		const resp = await fetch(`${env.CCBCHIMP_API_ADDRESS}/v1/api/bundle/check-user?${paramsString}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Api-key': env.CCBCHIMP_API_KEY,
				accept: 'application/json',
			},
		});

		if (resp.ok) {
			const json = await resp.json();

			if (json && json.status !== undefined && json.status === 0) {
				return null;
			}
			return json;
		}

		return null;
	} catch (e) {
		console.error(e);
		return null;
	}
}
