const path = require('path');
const { guardarIncidencia, ReporteIncidenciaFechas, ReporteIncidenciaFilial } = require('../models/incidencias.model');
const { enviarCorreo } = require('../utils/mailer');
const FilialService = require('./filial.service');

exports.reportarIncidenciaService = async ({filial_id, correo_user, archivos, realSubject, text, url_por_defecto}) => {
    try {
        console.log('🔧 INICIANDO SERVICIO ================');
        console.log('Datos recibidos en servicio:', {
            filial_id,
            correo_user,
            numArchivos: archivos ? archivos.length : 0,
            url_por_defecto,
            realSubject,
            textLength: text ? text.length : 0
        });

        console.log('📧 Obteniendo correo del proveedor para filial ID:', filial_id);
        
        // Obtener el correo del proveedor desde la base de datos
        const filial = await FilialService.getFilialById(filial_id);
        
        if (!filial) {
            throw new Error(`Filial con ID ${filial_id} no encontrada`);
        }

        console.log('✅ Filial encontrada:', {
            id: filial.IDfilial,
            nombre: filial.nombre,
            correoProveedor: filial.CorreoProveedor
        });

        // Validar que el correo del proveedor existe
        if (!filial.CorreoProveedor) {
            throw new Error(`No se encontró CorreoProveedor para la filial ${filial.nombre}`);
        }

        // ✅ MODIFICADO: Procesar múltiples correos del campo CorreoProveedor
        const correosDestino = filial.CorreoProveedor
            .split(';') // Separar por punto y coma
            .map(correo => correo.trim()) // Eliminar espacios
            .filter(correo => correo !== ''); // Eliminar vacíos

        console.log('📧 Correos destino procesados:', correosDestino);

        if (correosDestino.length === 0) {
            throw new Error(`No se encontraron correos válidos en CorreoProveedor para la filial ${filial.nombre}`);
        }

        const TO = correosDestino; // ✅ Ahora es un array de correos
        const CC = ['lcolindres@cooperativataulabe.hn'];

        console.log('📤 Enviando a:', TO);
        console.log('📎 CC:', CC);

        // ✅ MODIFICADO: Manejar URL por defecto
        let archivoUrls = [];
        let archivoPaths = [];

        if (archivos && archivos.length > 0) {
            // Si hay archivos reales
            archivoUrls = archivos.map(file => `/uploads/${file.filename}`);
            archivoPaths = archivos.map(file => file.path);
        } else if (url_por_defecto) {
            // Si hay URL por defecto
            archivoUrls = [url_por_defecto];
            console.log('📎 Usando URL por defecto:', url_por_defecto);
        } else {
            // Si no hay nada, usar array vacío
            archivoUrls = [];
            archivoPaths = [];
        }
        
        console.log('💾 Preparando para guardar en BD...');
        console.log('Archivos URLs:', archivoUrls);
        console.log('Archivos Paths:', archivoPaths);
        
        // Guardamos en la BD
        await guardarIncidencia(filial_id, archivoUrls, correo_user);

        console.log('📤 Enviando correo...');
        
        // Enviamos el correo - si no hay archivos reales, enviamos array vacío
        const responseEmail = await enviarCorreo({
            from: correo_user,
            to: TO, // ✅ Ahora envía a múltiples correos
            cc: CC,
            realSubject,
            text,
            archivos: archivoPaths, // Solo archivos reales, no URLs
        });

        console.log('✅ Proceso completado exitosamente. Correo enviado a', TO.length, 'destinatarios');

    } catch (error) {
        console.error('❌ Error en reportarIncidenciaService:', error.message);
        console.error('Stack trace:', error.stack);
        throw new Error(`Error en ReporteIncidenciaService: ${error.message}`);
    }
}

exports.incidentesPorID = async (ID) => {
    try {
        const IncidenciasFi = await ReporteIncidenciaFilial(ID);
        return IncidenciasFi;
    } catch (error) {
        throw new Error(`Error en incidentesPorID: ${error.message}`);
    }
}

exports.incidentesPorFecha = async (Inicial, Final) => {
    try {
        const IncidenciasFe = await ReporteIncidenciaFechas(Inicial, Final);
        return IncidenciasFe;
    } catch (error) {
        throw new Error(`Error en incidentesPorFecha: ${error.message}`);
    }
}