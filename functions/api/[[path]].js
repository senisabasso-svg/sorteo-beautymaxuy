const BACKEND = 'https://sorteo-beautymaxuy-production.up.railway.app';

export async function onRequest(context) {
  const { request, params } = context;
  const path = params.path ? `/${params.path}` : '';
  const incoming = new URL(request.url);
  const target = `${BACKEND}/api${path}${incoming.search}`;

  const headers = new Headers(request.headers);
  headers.set('host', new URL(BACKEND).host);

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  if (!['GET', 'HEAD'].includes(request.method)) {
    init.body = await request.arrayBuffer();
  }

  const response = await fetch(target, init);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
