export async function onRequestPost(context) {
  const { request, env } = context;

  const formData = await request.formData();

  // パスワード確認
  const password = formData.get("password");

  if (password !== env.UPLOAD_PW) {
    return new Response("ファイルを置くにはパスワードが必要です", {
      status: 401,
    });
  }

  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return new Response("No file", {
      status: 400,
    });
  }

  // 最大サイズ制限（10MB）
  const MAX_SIZE = 20 * 1024 * 1024;

  if (file.size > MAX_SIZE) {
    return new Response("ファイルサイズは20MBまでです", {
      status: 413,
    });
  }

  // 拡張子制限
  //const allowed = [
  //  "image/png",
  //  "image/jpeg",
  //  "application/pdf",
  //];

  //if (!allowed.includes(file.type)) {
  //  return new Response("Invalid file type", {
  //    status: 400,
  //  });
  //}

  // 保存名
  const key =
    `uploads/${Date.now()}-${file.name}`;

  // R2へ保存
  await env.BUCKET.put(
    key,
    file.stream(),
    {
      httpMetadata: {
        contentType: file.type,
      },
    }
  );

  return new Response("Upload OK");
}
