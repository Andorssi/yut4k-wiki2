export async function onRequestPost(context) {
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

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    return new Response("File too large", { status: 413 });
  }

  if (!allowedTypes.includes(file.type)) {
    return new Response("Invalid file type", { status: 400 });
  }

  const originalName = file.name.replace(/[^\w.\-ぁ-んァ-ヶ一-龠]/g, "_");
  const ext = originalName.includes(".")
    ? originalName.split(".").pop()
    : "bin";

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
}