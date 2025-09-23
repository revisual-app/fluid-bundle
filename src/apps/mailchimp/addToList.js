import { getEnv } from '../../context';

export async function addSubscriber(email, name, tags) {
  const env = getEnv();

  const MAILCHIMP_API_KEY = env.MAILCHIMP_API_KEY;
  const DATACENTER = MAILCHIMP_API_KEY.split('-')[1];
  const LIST_ID = env.MAILCHIMP_AUDIENCE_ID;

  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  const body = {
    email_address: email,
    status: 'subscribed', // "pending" if you want double opt-in
    merge_fields: {
      FNAME: name,
    },
    tags,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `apikey ${MAILCHIMP_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mailchimp API error: ${error}`);
  }

  const data = await response.json();
  return data;
}

// Example usage:
//addSubscriber('example@email.com', 'John Doe', ['newsletter', 'business'])
//  .then((res) => console.log('Added:', res.id))
//  .catch((err) => console.error(err.message));
