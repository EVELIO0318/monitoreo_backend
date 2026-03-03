const db=require('../utils/db');

class Filiales{

    static async getFiliales(){
        const [rows]= await db.execute('SELECT * FROM filiales_ventanillas ORDER BY IdFilial ASC');
        return rows;
    }

    static async actualizarEstado(id,estado){
        try {
            const [result]= await db.execute("UPDATE filiales_ventanillas SET estado_actual=?,ultima_revision=NOW() WHERE IDfilial=?",[estado,id]);
            return result;
        } catch (error) {
             console.error(`Error al actualizar estado de filial ID ${id}:`, error);
             throw error;
        }
    }

    static async getCircuits(IDfilial) {
        try {
            const [result]= await db.execute("SELECT * FROM circuitid WHERE IDfilial=? ORDER BY id ASC",[IDfilial]);
            return result;
        } catch (error) {
            console.error(`Error al traer los CircuitsID:`, error);
             throw error;
        }
    }

    // NUEVO MÉTODO: Obtener filial por ID
    static async getFilialById(idFilial) {
        try {
            const query = `
                SELECT * FROM filiales_ventanillas 
                WHERE IdFilial = ? 
                LIMIT 1
            `;
            const [rows] = await db.execute(query, [idFilial]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error al obtener filial por ID:', error);
            throw error;
        }
    }
}

module.exports=Filiales;