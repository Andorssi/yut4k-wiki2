export async function onRequest(context) {
  const url = new URL(context.request.url);

  // ログアウト処理
  if (url.pathname === "/logout") {
    return new Response("Logged out", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Restricted Area"',
      },
    });
  }

  const USERNAME = context.env.USERNAME;
  const PASSWORD = context.env.PASSWORD;

  const authHeader = context.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Restricted Area"',
      },
    });
  }

  const encoded = authHeader.slice(6);
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