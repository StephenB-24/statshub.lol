import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { IncomingMessage } from 'http';
import { URL } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Dynamic proxy route: /proxy/:host/<path>
app.use('/proxy/:host', (req: Request, res: Response, next: NextFunction) => {
  const host = req.params.host;
  const proxy = createProxyMiddleware({
    target: `https://${host}`,
    changeOrigin: true,
    pathRewrite: {
      [`^/proxy/${host}`]: '',
    },
    onProxyRes: (proxyRes: IncomingMessage, _req: Request, _res: Response) => {
      // Remove CSP and frame options headers
      if (proxyRes.headers['content-security-policy']) {
        delete proxyRes.headers['content-security-policy'];
      }
      if (proxyRes.headers['x-frame-options']) {
        delete proxyRes.headers['x-frame-options'];
      }
      // Rewrite redirect locations to continue through the proxy
      const location = proxyRes.headers['location'];
      if (location) {
        const redirectUrl = new URL(location.toString());
        proxyRes.headers['location'] = `/proxy/${redirectUrl.host}${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
      }
    },
  });
  return proxy(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
}); 