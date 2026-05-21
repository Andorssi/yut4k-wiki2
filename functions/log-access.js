export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const body = await request.json().catch(() => ({}));

    const ip =
      request.headers.get("CF-Connecting-IP") || "unknown";

    const country =
      request.cf?.country ||
      request.headers.get("CF-IPCountry") ||
      "unknown";

    const userAgent =
      request.headers.get("User-Agent") || "unknown";

    const log = {
      time: new Date().toISOString(),
      path: body.path || "/",
      title: body.title || "",
      action: body.action || "view",
      ip,
      country,
      userAgent,
    };

    const key = "logs/access-log.jsonl";

    const oldObject = await env.BUCKET.get(key);
    const oldText = oldObject
      ? await oldObject.text()
      : "";

    const newText =
      oldText + JSON.stringify(log) + "\n";

    await env.BUCKET.put(key, newText, {
      httpMetadata: {
        contentType: "application/jsonl; charset=utf-8",
      },
    });

    return Response.json({ ok: true });
  } catch (error) {
    return new Response("Log access error: " + error.message, {
      status: 500,
    });
  }
}