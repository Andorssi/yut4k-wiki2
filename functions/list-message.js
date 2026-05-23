export async function onRequestGet(context) {
  try {
    const { env } = context;

    const key = "posts/messages.json";

    const object = await env.BUCKET.get(key);

    if (!object) {
      return Response.json([]);
    }

    const messages = await object.json();

    return Response.json(messages);
  } catch (error) {
    return new Response("List messages error: " + error.message, {
      status: 500,
    });
  }
}