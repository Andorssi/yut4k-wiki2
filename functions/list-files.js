export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const formData = await request.formData();

    const password = formData.get("password");
    if (password !== env.UPLOAD_PW) {
      return new Response("Unauthorized", { status: 401 });
    }

    const listed = await env.BUCKET.list({
      prefix: "uploads/",
    });

    const files = await Promise.all(
      listed.objects.map(async (object) => {
        const head = await env.BUCKET.head(object.key);

        const originalName =
          head?.customMetadata?.originalName ||
          object.key.split("/").pop();

        return {
          key: object.key,
          name: originalName,
          size: object.size,
          uploaded: object.uploaded,
        };
      })
    );

    return Response.json(files);
  } catch (error) {
    return new Response("List files error: " + error.message, {
      status: 500,
    });
  }
}