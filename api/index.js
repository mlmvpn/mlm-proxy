export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const target = url.searchParams.get("url");

  if (!target) {
    return new Response("No target URL provided", { status: 400 });
  }

  try {
    // کپی کردن هدرهای اصلی (مثل توکن‌های Cloudflare)
    const newHeaders = new Headers(req.headers);
    newHeaders.delete("host"); // حذف هدر هاست برای جلوگیری از خطای 403 کلودفلر

    const options = {
      method: req.method,
      headers: newHeaders,
    };

    // اگر متد GET یا HEAD نبود، بادی (Body) ریکوئست رو هم منتقل کن
    if (req.method !== "GET" && req.method !== "HEAD") {
      options.body = await req.arrayBuffer();
    }

    const response = await fetch(target, options);
    const data = await response.arrayBuffer();

    return new Response(data, {
      status: response.status,
      headers: response.headers,
    });
  } catch (err) {
    return new Response("Proxy Error: " + err.message, { status: 500 });
  }
}
