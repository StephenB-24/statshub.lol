"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const url_1 = require("url");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
// Dynamic proxy route: /proxy/:host/<path>
app.use('/proxy/:host', (req, res, next) => {
    const host = req.params.host;
    const proxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: `https://${host}`,
        changeOrigin: true,
        pathRewrite: {
            [`^/proxy/${host}`]: '',
        },
        onProxyRes: (proxyRes, _req, _res) => {
            // Remove CSP and frame options headers
            if (proxyRes.headers['content-security-policy']) {
                delete proxyRes.headers['content-security-policy'];
            }
            if (proxyRes.headers['x-frame-options']) {
                proxyRes.headers['x-frame-options'] = 'ALLOWALL';
            }
            // Rewrite redirect locations to continue through the proxy
            const location = proxyRes.headers['location'];
            if (location) {
                try {
                    const redirectUrl = new url_1.URL(location.toString(), `https://${host}`);
                    proxyRes.headers['location'] = `/proxy/${redirectUrl.host}${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
                }
                catch (err) {
                    console.error('Failed to rewrite redirect location', location, err);
                }
            }
        },
    });
    return proxy(req, res, next);
});
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
