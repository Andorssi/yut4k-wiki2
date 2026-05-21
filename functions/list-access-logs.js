export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const formData = await request.formData();

    const password = formData.get("password");
    if (password !== env.UPLOAD_PW) {
      return new Response("Unauthorized", { status: 401 });
    }

    const key = "logs/access-log.jsonl";

    const object = await env.BUCKET.get(key);

    if (!object) {
      return Response.json({
        total: 0,
        logs: [],
      });
    }

    const text = await object.text();

    const logs = text
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .reverse()
      // .slice(0, 100);

    return Response.json({
      total: text.trim() ? text.trim().split("\n").length : 0,
      logs,
    });
  } catch (error) {
    return new Response("List logs error: " + error.message, {
      status: 500,
    });
  }
}