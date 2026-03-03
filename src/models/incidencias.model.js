const db = require('../utils/db');

class Incidencias {
    static async guardarIncidencia(filial_id, urls, correoUser) {
        try {
            console.log('💾 Guardando incidencia en BD:', {
                filial_id,
                numUrls: urls.length,
                correoUser
            });

            const query = `INSERT INTO incidencias(filial_id, fecha_reporte, archivo_url, correo_user) VALUES (?, NOW(), ?, ?)`;
            
            // ✅ CORREGIDO: Manejar array vacío correctamente
            const archivo_json = urls && urls.length > 0 ? JSON.stringify(urls) : JSON.stringify([]);
            
            console.log('📄 JSON a guardar:', archivo_json);
            
            const [result] = await db.execute(query, [filial_id, archivo_json, correoUser]);
            
            console.log('✅ Incidencia guardada en BD con ID:', result.insertId);
            return result;
        } catch (error) {
            console.error('❌ Error al guardar incidencia en BD:', error);
            throw error;
        }
    }

    static async ReporteIncidenciaFechas(FechaI, FechaF) {
        try {
            const [result] = await db.execute(
                "SELECT i.IDincidencias, f.nombre, i.filial_id, i.fecha_reporte, i.archivo_url, i.correo_user FROM incidencias i INNER JOIN filiales_ventanillas f ON i.filial_id = f.IDfilial WHERE fecha_reporte BETWEEN ? AND ?",
                [FechaI, FechaF]
            );
            return result;
        } catch (error) {
            console.error('Error en ReporteIncidenciaFechas:', error);
            throw error;
        }
    }
    
    static async ReporteIncidenciaFilial(IDfilial) {
        try {
            const [result] = await db.execute(
                "SELECT * FROM incidencias WHERE filial_id = ?",
                [IDfilial]
            );
            return result;
        } catch (error) {
            console.error('Error en ReporteIncidenciaFilial:', error);
            throw error;
        }
    }
}

module.exports = Incidencias;