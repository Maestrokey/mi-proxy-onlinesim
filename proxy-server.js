// proxy-server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

app.use('/api/*', createProxyMiddleware({
  target: 'https://onlinesim.io',
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy server corriendo en el puerto ${PORT}`);
});