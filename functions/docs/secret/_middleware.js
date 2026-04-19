export async function onRequest(context) {
  const USERNAME = context.env.USERNAME;
  const PASSWORD = context.env.PASSWORD;
  const KV = context.env.LOGIN_RL;

  const url = new URL(context.request.url);
  const path = url.pathname;

  // 元の訪問者IP
  const ip =
    context.request.headers.get("CF-Connecting-IP") ||
    "unknown";

  // 設定値
  const MAX_FAILS = 5;          // 失敗5回で
  const WINDOW_SEC = 10 * 60;   // 10分ブロック
  const REALM = "Restricted Area";

  // ログアウト用
  if (path === "/logout") {
    return new Response("Logged out", {
      status: 401,
      headers: {
        "WWW-Authenticate": `Basic realm="${REALM}"`,
      },
    });
  }

  const key = `rl:${ip}`;

  // 既存の失敗情報を読む
  const raw = await KV.get(key);
  const now = Date.now();

  let state = {
    fails: 0,
    blockedUntil: 0,
  };

  if (raw) {
    try {
      state = JSON.parse(raw);
    } catch {
      // 壊れたデータは捨てる
      state = { fails: 0, blockedUntil: 0 };
    }
  }

  // まだブロック中なら拒否
  if (state.blockedUntil && now < state.blockedUntil) {
    const retryAfter = Math.ceil((state.blockedUntil - now) / 1000);
    return new Response("Too many failed attempts. Try again later.", {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
      },
    });
  }

  const authHeader = context.request.headers.get("Authorization");

  // 認証ヘッダなし
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": `Basic realm="${REALM}"`,
      },
    });
  }

  let user = "";
  let pass = "";

  try {
    const encoded = authHeader.slice(6);
    const decoded = atob(encoded);
    [user, pass] = decoded.split(":");
  } catch {
    return new Response("Bad Authorization header", { status: 400 });
  }

  // 認証成功
  if (user === USERNAME && pass === PASSWORD) {
    await KV.delete(key);
    return context.next();
  }

  // 認証失敗
  state.fails += 1;

  if (state.fails >= MAX_FAILS) {
    state.blockedUntil = now + WINDOW_SEC * 1000;
  } else {
    state.blockedUntil = 0;
  }

  await KV.put(key, JSON.stringify(state), {
    expirationTtl: WINDOW_SEC,
  });

  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}"`,
    },
  });
}