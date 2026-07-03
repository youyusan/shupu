import { request } from 'http';
import { connect as tlsConnect } from 'tls';
import { URL } from 'url';

/**
 * 代理感知的 fetch：如果环境变量 HTTP_PROXY/HTTPS_PROXY 存在，
 * 通过 HTTP CONNECT 隧道发起 HTTPS 请求。
 * 否则直接使用原生 fetch。
 */
export async function proxyFetch(
  url: string,
  options: { signal?: AbortSignal; timeout?: number } = {}
): Promise<Response> {
  const { signal, timeout = 8000 } = options;
  const proxyUrlStr = process.env.HTTPS_PROXY || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.https_proxy;

  // 无代理环境：直接用原生 fetch
  if (!proxyUrlStr) {
    return fetch(url, { signal: signal ?? AbortSignal.timeout(timeout) });
  }

  // 有代理：通过 HTTP CONNECT 隧道
  return new Promise<Response>((resolve, reject) => {
    const target = new URL(url);
    const proxy = new URL(proxyUrlStr);

    const connectReq = request({
      host: proxy.hostname,
      port: proxy.port || 8080,
      method: 'CONNECT',
      path: `${target.hostname}:443`,
    });

    const timer = setTimeout(() => {
      connectReq.destroy();
      reject(new Error(`Proxy CONNECT timeout after ${timeout}ms`));
    }, timeout);

    if (signal) {
      signal.addEventListener('abort', () => {
        connectReq.destroy();
        clearTimeout(timer);
        reject(new Error('Aborted'));
      });
    }

    connectReq.on('connect', (_res, socket) => {
      clearTimeout(timer);
      const tlsSocket = tlsConnect(
        { socket, servername: target.hostname },
        () => {
          const path = target.pathname + target.search;
          const reqLines = [
            `GET ${path} HTTP/1.1`,
            `Host: ${target.hostname}`,
            'Connection: close',
            '',
            '',
          ];
          tlsSocket.write(reqLines.join('\r\n'));

          let rawData = '';
          tlsSocket.on('data', (d) => { rawData += d.toString('utf-8'); });
          tlsSocket.on('end', () => {
            const headerEnd = rawData.indexOf('\r\n\r\n');
            if (headerEnd === -1) {
              reject(new Error('Invalid HTTP response'));
              return;
            }
            const headerBlock = rawData.substring(0, headerEnd);
            const body = rawData.substring(headerEnd + 4);
            const lines = headerBlock.split('\r\n');
            const statusLine = lines[0];
            const statusCode = parseInt(statusLine.split(' ')[1], 10);
            const headers = new Headers();
            for (let i = 1; i < lines.length; i++) {
              const colonIdx = lines[i].indexOf(':');
              if (colonIdx > 0) {
                headers.append(
                  lines[i].substring(0, colonIdx).trim(),
                  lines[i].substring(colonIdx + 1).trim()
                );
              }
            }
            resolve(new Response(body, { status: statusCode, headers }));
          });
          tlsSocket.on('error', (err) => reject(err));
        }
      );
    });

    connectReq.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });

    connectReq.end();
  });
}
