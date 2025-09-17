export async function addToWaitlist(request) {
  if (request.method === 'POST') {
    const body = await request.json();
    const { email, name, integrations } = body;

    console.log('addToWaitlist', email, name, integrations);
    return {
      success: true,
    };
  }

  return null;
}
