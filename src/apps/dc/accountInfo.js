import { getEnv } from '../../context';

export async function getAccountInfo(email, ccbAccountName) {
  try {
    const env = getEnv();

    console.log('Requesting info from', env.DC_API_ADDRESS);

    const resp = await fetch(env.DC_API_ADDRESS + '/api4/public/find_ccb.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-key': env.DC_API_KEY,
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        ccb_account: ccbAccountName,
      }),
    });

    if (resp.ok) {
      const json = await resp.json();

      console.log('DC getAccountInfo', json);

      return json;
    }
    return null;
  } catch (e) {
    console.error(e);
  }
}
