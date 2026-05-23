export async function onRequestGet(context) {
  try {
    const { env, params } = context;

    const key = Array.isArray(params.key)
      ? params.key.join("/")
      : params.key;

    if (!key.startsWith("posts/images/")) {
      return new Response("Invalid key", { status: 400 });
    }

    const object = await env.BUCKET.get(key);

    if (!object) {
      return new Response("Image not found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Cache-Control", "public, max-age=3600");

    return new Response(object.body, { headers });
  } catch (error) {
    return new Response("Post image error: " + error.message, {
      status: 500,
    });
  }
}
