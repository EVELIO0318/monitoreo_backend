const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();


const {iniciarMonitoreo}=require('./monitor/ping-monitor');

// Middlewares
app.use(cors()); // Permitir peticiones desde el frontend (React)
app.use('/uploads', express.static(path.resolve('uploads')));
app.use(morgan('dev')); // Mostrar logs de peticiones en consola
app.use(express.json()); // Permitir leer JSON en los body
app.use(express.urlencoded({ extended: true })); // Para leer datos codificados (form-data)

// Aquí se agregarán las rutas
app.use('/api/filiales', require('./routes/filialRoutes'));
app.use('/api/incidencias', require('./routes/incidenciasRoutes'));

iniciarMonitoreo();

// 🔴 Middleware de manejo de errores: debe ir después de TODAS las rutas
app.use((err, req, res, next) => {
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'El archivo es demasiado grande' });
  }

  // Otros errores no controlados
  console.error('Error inesperado:', err);
  return res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;