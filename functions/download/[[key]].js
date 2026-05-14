export async function onRequestPost(context) {
  const { request, env, params } = context;

  const formData = await request.formData();

  const password = formData.get("password");
  if (password !== env.UPLOAD_PASSWORD) {
    return new Response("Unauthorized", { status: 401 });
  }

  const key = params.key.join("/");

  if (!key.startsWith("uploads/")) {
    return new Response("Invalid key", { status: 400 });
  }

  const object = await env.BUCKET.get(key);

  if (!object) {
    return new Response("File not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);

  const filename =
    object.customMetadata?.originalName ||
    key.split("/").pop();

  headers.set("etag", object.httpEtag);
  headers.set(
    "Content-Disposition",
    `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
  );

  return new Response(object.body, { headers });
}