export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const target = url.searchParams.get("url");

  if (!target) {
    return new Response("No target URL provided", { status: 400 });
  }

  try {
    const response = await fetch(target);
    const data = await response.text();
    return new Response(data, {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });
  } catch (err) {
    return new Response("Error fetching data", { status: 500 });
  }
}
