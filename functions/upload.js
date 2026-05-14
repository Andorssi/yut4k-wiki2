export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    if (!env.BUCKET) {
      return new Response("R2 binding BUCKET is not set", { status: 500 });
    }

    if (!env.UPLOAD_PASSWORD) {
      return new Response("UPLOAD_PASSWORD is not set", { status: 500 });
    }

    const formData = await request.formData();

    const password = formData.get("password");
    if (password !== env.UPLOAD_PASSWORD) {
      return new Response("Unauthorized", { status: 401 });
    }

    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return new Response("No file", { status: 400 });
    }

    const MAX_SIZE = 20 * 1024 * 1024; // 20MB

    if (file.size > MAX_SIZE) {
      return new Response("File too large", { status: 413 });
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
      "text/plain",
      "application/zip",
      "application/x-zip-compressed",
    ];

    if (!allowedTypes.includes(file.type)) {
      return new Response("Invalid file type: " + file.type, {
        status: 400,
      });
    }

    const originalName = file.name.replace(/[^\w.\-ぁ-んァ-ヶ一-龠]/g, "_");
    const key = `uploads/${crypto.randomUUID()}-${originalName}`;

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
    return new Response(
      "Upload function error: " + error.message,
      { status: 500 }
    );
  }
}