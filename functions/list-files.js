export async function onRequestPost(context) {
  const { request, env } = context;

  const formData = await request.formData();

  const password = formData.get("password");
  if (password !== env.UPLOAD_PASSWORD) {
    return new Response("Unauthorized", { status: 401 });
  }

  const listed = await env.BUCKET.list({
    prefix: "uploads/",
  });

  const files = listed.objects.map((object) => {
    const name =
      object.customMetadata?.originalName ||
      object.key.replace("uploads/", "");

    return {
      key: object.key,
      name,
      size: object.size,
      uploaded: object.uploaded,
      url: `/download/${object.key}`,
    };
  });

  return Response.json(files);
}