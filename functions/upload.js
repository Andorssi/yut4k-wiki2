export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const formData = await request.formData();

    const password = formData.get("password");
    if (password !== env.UPLOAD_PW) {
      return new Response("Unauthorized", { status: 401 });
    }

    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return new Response("No file", { status: 400 });
    }

    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return new Response("File too large", { status: 413 });
    }

    const originalName = file.name;
    const ext = originalName.includes(".")
      ? originalName.split(".").pop()
      : "bin";

    const key = `uploads/${crypto.randomUUID()}.${ext}`;

    await env.BUCKET.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type || "application/octet-stream",
      },
      customMetadata: {
        originalName,
      },
    });

    return Response.json({
      ok: true,
      name: originalName,
      key,
      url: `/download/${key}`,
    });
  } catch (error) {
    return new Response("Upload function error: " + error.message, {
      status: 500,
    });
  }
}