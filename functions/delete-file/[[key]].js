export async function onRequestPost(context) {
  try {
    const { request, env, params } = context;

    const formData = await request.formData();

    const password = formData.get("password");
    if (password !== env.UPLOAD_PW) {
      return new Response("Unauthorized", { status: 401 });
    }

    const key = Array.isArray(params.key)
      ? params.key.join("/")
      : params.key;

    if (!key.startsWith("uploads/")) {
      return new Response("Invalid key", { status: 400 });
    }

    await env.BUCKET.delete(key);

    return new Response("Deleted");
  } catch (error) {
    return new Response("Delete error: " + error.message, {
      status: 500,
    });
  }
}