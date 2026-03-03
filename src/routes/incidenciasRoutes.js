const express = require('express');
const { reportarIncidencia, ReportePorId, ReportePorFechas } = require('../controllers/incidencias.controller');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configuración de almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan los archivos
  },
  filename: (req, file, cb) => {
    const nameWithoutSpaces = file.originalname.replace(/\s+/g, '_');
    const uniqueName = Date.now() + '-' + nameWithoutSpaces;
    cb(null, uniqueName);
  }
});

// Filtrar tipo de archivo - MODIFICADO para ser opcional
const fileFilter = (req, file, cb) => {
  // Si no hay archivo, continuar
  if (!file) {
    return cb(null, true);
  }
  
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.pdf') {
    cb(null, true); // Aceptar archivo
  } else {
    const error = new Error('Solo se permiten archivos JPG, JPEG, PNG o PDF');
    error.code = 'INVALID_FILE_TYPE';
    cb(error); // Rechazar
  }
};

// Configuración de multer modificada
const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB límite
  }
});

// Middleware personalizado para manejar archivos opcionales
const handleFileUpload = (req, res, next) => {
  upload.array('archivos')(req, res, function (err) {
    if (err) {
      // Si es error de tipo de archivo, devolver error específico
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ error: err.message });
      }
      // Para otros errores de multer, continuar (archivos opcionales)
      console.log('Multer error (continuando sin archivos):', err.message);
    }
    next();
  });
};

// Ruta modificada para aceptar archivos opcionales
router.post('/guardarIncidencia', handleFileUpload, reportarIncidencia);
router.get('/incidenciasporid', ReportePorId);
router.get('/incidenciasporfecha', ReportePorFechas);

module.exports = router;