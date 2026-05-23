export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const formData = await request.formData();

    const password = formData.get("password");
    if (password !== env.UPLOAD_PW) {
      return new Response("Unauthorized", { status: 401 });
    }

    const text = String(formData.get("text") || "").trim();

    const imageField = formData.get("image");

    const hasImage =
      imageField &&
      typeof imageField !== "string" &&
      imageField.size > 0;

    if (!text && !hasImage) {
      return new Response("本文または画像が必要です", { status: 400 });
    }

    if (text.length > 280) {
      return new Response("280文字以内にしてください", { status: 400 });
    }

    let imageKey = null;

    if (hasImage) {
      if (!imageField.type.startsWith("image/")) {
        return new Response("画像ファイルのみ投稿できます", { status: 400 });
      }

      const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

      if (imageField.size > MAX_IMAGE_SIZE) {
        return new Response("画像は5MB以内にしてください", { status: 413 });
      }

      let ext = "jpg";

      if (imageField.type === "image/png") {
        ext = "png";
      } else if (imageField.type === "image/webp") {
        ext = "webp";
      } else if (imageField.type === "image/gif") {
        ext = "gif";
      }

      imageKey =
        `posts/images/${crypto.randomUUID()}.${ext}`;

      await env.BUCKET.put(imageKey, imageField.stream(), {
        httpMetadata: {
          contentType: imageField.type,
        },
      });
    }

    const key = "posts/messages.json";

    const oldObject = await env.BUCKET.get(key);

    let messages = [];

    if (oldObject) {
      messages = await oldObject.json();
    }

    messages.unshift({
      id: crypto.randomUUID(),
      text,
      imageKey,
      imageUrl: imageKey
        ? `/post-image/${imageKey}`
        : null,
      createdAt: new Date().toISOString(),
    });

    await env.BUCKET.put(
      key,
      JSON.stringify(messages, null, 2),
      {
        httpMetadata: {
          contentType:
            "application/json; charset=utf-8",
        },
      }
    );

    return Response.json({
      ok: true,
    });

  } catch (error) {
    return new Response(
      "Post message error: " + error.message,
      { status: 500 }
    );
  }
}