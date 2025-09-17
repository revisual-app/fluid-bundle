export async function checkAddress(request) {
  if (request.method === 'POST') {
    const body = await request.json();
    const { address } = body;

    const response = await fetch('http://' + address);

    const ccbBody = await response.text();
    console.log('body', ccbBody);
    if (!response.ok) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  }

  return null;
}
