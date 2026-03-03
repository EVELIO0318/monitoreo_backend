const { reportarIncidenciaService, incidentesPorID, incidentesPorFecha } = require("../services/incidencias.service");

const reportarIncidencia = async (req, res, next) => {
    try {
        // console.log(req.body);
        const {
            filial_id,
            correo_user,
            text,
            filialName,
        } = req.body;

        // console.log(subject);

        const archivos = req.files;

        if (!filial_id || !correo_user || !text) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // ✅ ELIMINADO: La validación que requería archivos obligatorios
        // if (!archivos || archivos.length === 0) {
        //     return res.status(400).json({ error: 'Debe adjuntar al menos un archivo.' });
        // }

        const realSubject = `Caida en Filial ${filialName}`;

        const data = {
            filial_id,
            correo_user,
            realSubject,
            text,
            archivos: req.files || [] // ✅ Ahora acepta array vacío si no hay archivos
        };

        await reportarIncidenciaService(data);
        res.status(200).json({ 
            code: 200,
            mensaje: data
        });
    } catch (error) {
        console.error('Error al reportar incidencia:', error);
        res.status(500).json({ error: 'No se pudo reportar la incidencia' });
    }
}

const ReportePorId = async (req, res, next) => {
    try {
        const { IDfilial } = req.query;
    
        const IncidenciasPorId = await incidentesPorID(IDfilial);
    
        res.status(200).json({
            code: 200,
            data: IncidenciasPorId
        })
    } catch (error) {
        console.error('Error al reportar incidencia:', error);
        res.status(500).json({
            error: 'No se ha podido traer el reporte por ID'
        })
    }
}

const ReportePorFechas = async (req, res, next) => {
    try {
        const { FechaI, FechaF } = req.query;

        if (FechaF < FechaI) {
            return res.status(400).json({ error: 'La fecha final no puede ser menor que la Inicial' });
        }

        const IncidenciasPorFecha = await incidentesPorFecha(FechaI, FechaF);

        res.status(200).json({
            code: 200,
            data: IncidenciasPorFecha
        })
    } catch (error) {
        console.error('Error al obtener reportes por fecha:', error);
        res.status(500).json({
            error: 'No se ha podido traer el reporte por fechas'
        })
    }
}

module.exports = { reportarIncidencia, ReportePorId, ReportePorFechas }