export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const formData = await request.formData();

    const password = formData.get("password");
    if (password !== env.UPLOAD_PW) {
      return new Response("Unauthorized", { status: 401 });
    }

    const id = String(formData.get("id") || "");

    if (!id) {
      return new Response("id is required", { status: 400 });
    }

    const key = "posts/messages.json";

    const object = await env.BUCKET.get(key);

    if (!object) {
      return new Response("messages.json not found", { status: 404 });
    }

    let messages = await object.json();

    if (!Array.isArray(messages)) {
      messages = [];
    }

    const target = messages.find((message) => message.id === id);

    if (!target) {
      return new Response("message not found", { status: 404 });
    }

    messages = messages.filter((message) => message.id !== id);

    await env.BUCKET.put(key, JSON.stringify(messages, null, 2), {
      httpMetadata: {
        contentType: "application/json; charset=utf-8",
      },
    });

    if (target.imageKey) {
      await env.BUCKET.delete(target.imageKey);
    }

    return Response.json({ ok: true });
  } catch (error) {
    return new Response("Delete message error: " + error.message, {
      status: 500,
    });
  }
}