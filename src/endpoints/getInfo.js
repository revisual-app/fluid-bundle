import { getAccountInfo as dc_accountInfo } from './../apps/dc/accountInfo';
import { getAccountInfo as cb_accountInfo } from './../apps/cb/accountInfo';
import { getAccountInfo as ccbchimp_accountInfo } from './../apps/ccbchimp/accountInfo';
export async function getInfo(request) {
  if (request.method === 'POST') {
    // console.log('Handling POST request');
    const body = await request.json();
    console.log('getInfo', body);
    const { email, ccb_account } = body;

    const [dc, cb, ccbchimp] = await Promise.all([
      dc_accountInfo(email, ccb_account),
      cb_accountInfo(email, ccb_account),
      ccbchimp_accountInfo(email, ccb_account),
    ]);

    return {
      dc,
      cb,
      ccbchimp,
    };
  }

  return null;
}
