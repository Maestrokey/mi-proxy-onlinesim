const http = require('http');
const httpProxy = require('http-proxy');
const express = require('express');
const url = require('url');

const app = express();
const proxy = httpProxy.createProxyServer({});

// Variable de entorno para la API Key de OnlineSim
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error('ERROR: La variable de entorno API_KEY no está configurada.');
  process.exit(1);
}

// Middleware para manejar las peticiones al proxy
app.use('/api', (req, res) => {
  // Construimos la URL de destino para OnlineSim
  const targetUrl = `https://onlinesim.io${req.path}?apikey=${API_KEY}`;

  // Opciones para el proxy
  const options = {
    target: targetUrl,
    changeOrigin: true, // Esencial para que el destino (onlinesim.io) funcione bien
    ignorePath: true, // Ignora la ruta original porque ya la construimos en targetUrl
  };

  // Reenviamos la petición
  proxy.web(req, res, options, (err) => {
    console.error('Error en el proxy:', err);
    res.status(500).send('Error en el proxy.');
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
const PORT = process.env.PORT || 10000;
http.createServer(app).listen(PORT, () => {
  console.log(`🚀 Servidor Proxy corriendo en el puerto ${PORT}`);
});
