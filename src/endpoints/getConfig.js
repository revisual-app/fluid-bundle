import { getEnv } from '../context';

export async function getConfig(request) {
  const env = getEnv();
  return {
    success: true,
    gtagId: env.GTAG_ID || '',
    intercomAppId: env.INTERCOM_APP_ID || '',
  };
}
