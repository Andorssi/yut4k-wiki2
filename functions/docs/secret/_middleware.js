export async function onRequest(context) {
  const USERNAME = context.env.USERNAME;
  const PASSWORD = context.env.PASSWORD;

  const authHeader = context.request.headers.get("Authorization");

  if (!authHeader) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Restricted Area"',
      },
    });
  }

  const encoded = authHeader.split(" ")[1];
  const decoded = atob(encoded);
  const [user, pass] = decoded.split(":");

  if (user === USERNAME && pass === PASSWORD) {
    return context.next();
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Restricted Area"',
    },
  });
}
