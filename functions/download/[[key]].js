export async function onRequestPost(context) {
  try {
    const { request, env, params } = context;

    const formData = await request.formData();

    const password = formData.get("password");

    if (password !== env.UPLOAD_PW) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    // ここ重要
    const key = Array.isArray(params.key)
      ? params.key.join("/")
      : params.key;

    console.log("DOWNLOAD KEY =", key);

    const object = await env.BUCKET.get(key);

    if (!object) {
      return new Response(
        "File not found: " + key,
        { status: 404 }
      );
    }

    const headers = new Headers();

    object.writeHttpMetadata(headers);

    headers.set(
      "Content-Disposition",
      `attachment; filename="${key.split("/").pop()}"`
    );

    return new Response(object.body, {
      headers,
    });

  } catch (error) {
    return new Response(
      "Download error: " + error.message,
      { status: 500 }
    );
  }
}