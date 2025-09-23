import { addSubscriber } from '../apps/mailchimp/addToList';

export async function addToWaitlist(request) {
  if (request.method === 'POST') {
    const body = await request.json();
    const { email, name, integrations } = body;

    const tags = integrations && Array.isArray(integrations) ? integrations : [];

    tags.push('waitlist');

    try {
      await addSubscriber(email, name, tags);
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
      };
    }
  }

  return null;
}
