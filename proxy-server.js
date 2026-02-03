const express = require('express');
const proxy = require('proxy-chain');

const app = express();
const port = process.env.PORT || 10000;

// Variable de entorno para la API Key de OnlineSim
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error('ERROR: La variable de entorno API_KEY no está configurada.');
  process.exit(1);
}

// Crear el proxy túnel
const proxyServer = proxy.createProxyServer({});

// Middleware para manejar todas las peticiones y reenviarlas al proxy túnel
app.use('/', (req, res) => {
  console.log(`Recibida petición: ${req.method} ${req.url}`);
  proxyServer.web(req, res, {
    target: 'https://onlinesim.io',
    changeOrigin: true,
  });
});

// Manejo de errores del proxy
proxyServer.on('error', (err, req, res) => {
  console.error('Error en el proxy:', err);
  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
  }
  res.end('Error de proxy.');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor Proxy Túnel corriendo en el puerto ${port}`);
});
