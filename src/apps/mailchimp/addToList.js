import { getEnv } from '../../context';
import { md5 } from '../../helpers';

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
    const error = await response.json();
    if (error.title === 'Member Exists') {
      const normalized = email.trim().toLowerCase();
      const subscriberHash = await md5(normalized);
      
      const updateUrl = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${subscriberHash}`;
      
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (!updateResponse.ok) {
        const updateError = await updateResponse.json();
        throw new Error(`Mailchimp API update error: ${JSON.stringify(updateError)}`);
      }
      
      return await updateResponse.json();
    }
    throw new Error(`Mailchimp API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data;
}

export async function updateSubscriberTags(email, name = '', tagsToAdd = [], tagsToRemove = []) {
  const env = getEnv();

  const MAILCHIMP_API_KEY = env.MAILCHIMP_API_KEY;
  const DATACENTER = MAILCHIMP_API_KEY.split('-')[1];
  const LIST_ID = env.MAILCHIMP_AUDIENCE_ID;

  const normalized = email.trim().toLowerCase();
  const subscriberHash = await md5(normalized);

  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${subscriberHash}/tags`;

  const tags = [
    ...tagsToAdd.map(tag => ({ name: tag, status: 'active' })),
    ...tagsToRemove.map(tag => ({ name: tag, status: 'inactive' })),
  ];

  const body = { tags };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `apikey ${MAILCHIMP_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    
    // If member not found (404), add them as a new subscriber
    if (response.status === 404) {
      console.log('Member not found, adding as new subscriber:', email);
      await addSubscriber(email, name, tagsToAdd);
      return { success: true };
    }
    
    throw new Error(`Mailchimp API tag update error: ${JSON.stringify(error)}`);
  }

  return { success: true };
}

// Example usage:
//addSubscriber('example@email.com', 'John Doe', ['newsletter', 'business'])
//  .then((res) => console.log('Added:', res.id))
//  .catch((err) => console.error(err.message));
