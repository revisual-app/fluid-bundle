export async function checkAddress(request) {
  if (request.method === 'POST') {
    const body = await request.json();
    const { address } = body;

    const response = await fetch('http://' + address);

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
