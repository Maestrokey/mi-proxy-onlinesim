const http = require('http');
const httpProxy = require('http-proxy');
const express = require('express');

const app = express();
const proxy = httpProxy.createProxyServer({});
const PORT = process.env.PORT || 10000;

// Variable de entorno para la API Key de OnlineSim
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error('ERROR: La variable de entorno API_KEY no está configurada.');
  process.exit(1);
}

// Middleware para manejar todas las peticiones y reenviarlas al proxy
app.use('/api', (req, res) => {
  console.log(`Recibida petición para: ${req.method} ${req.path}`);

  // Construimos la URL de destino para OnlineSim
  const targetUrl = `https://onlinesim.io${req.path}?apikey=${API_KEY}`;

  // Opciones para el proxy
  const options = {
    target: targetUrl,
    changeOrigin: true,
    ignorePath: true,
  };

  // Reenviamos la petición
  proxy.web(req, res, options, (err) => {
    console.error('Error en el proxy:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
    }
    res.end('Error en el proxy.');
  });
});

// Manejo de errores del proxy
proxy.on('error', (err, req, res) => {
  console.error('Error de proxy general:', err);
  if (!res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
  }
  res.end('Error de proxy.');
});

// Iniciar el servidor
http.createServer(app).listen(PORT, () => {
  console.log(`🚀 Servidor Proxy corriendo en el puerto ${PORT}`);
});
