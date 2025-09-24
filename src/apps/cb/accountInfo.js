import { getEnv } from '../../context';
import { objectToURLQuery } from '../../helpers';

export async function getAccountInfo(email, ccbAccountName) {
  try {
    const env = getEnv();

    console.log('Requesting info from', env.CB_API_ADDRESS);

    const paramsString = objectToURLQuery({
      email,
      ccb_account_name: ccbAccountName,
    });

    const resp = await fetch(`${env.CB_API_ADDRESS}/api/users/check?${paramsString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': env.CB_API_KEY,
        Authorization: env.CB_AUTH_KEY,
        accept: 'application/json',
      },
    });

    if (resp.ok) {
      const json = await resp.json();
      console.log('CB getAccountInfo', json);

      return json;
    }

    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
