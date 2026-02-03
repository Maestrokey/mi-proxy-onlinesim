const proxy = require('http-proxy-middleware');

// ... (código del servidor)

app.use(
  '/api',
  proxy.createProxyMiddleware({
    target: 'https://onlinesim.io',
    changeOrigin: true, // <-- ¡CAMBIO CLAVE! Esto ajusta las cabeceras para el túnel.
    pathRewrite: {
      '^/api': '', // Elimina '/api' de la URL
    },
    onProxyReq: (proxyReq, req, res) => {
      // Inyecta tu API Key aquí
      proxyReq.path += '?apikey=' + process.env.API_KEY;
    },
  })
);
