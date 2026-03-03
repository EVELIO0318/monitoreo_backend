const FilialService = require('../services/filial.service');

const AllFiliales = async (req, res, next) => {
    try {
        const Filiales = await FilialService.getAllFiliales();
        res.status(200).json({
            Filiales
        });
    } catch (error) {
        next(error);
    }
}

const AllCircuits = async (req, res, next) => {
    try {
        const { IDfilial } = req.query;
        const Circuits = await FilialService.getAllCircuits(IDfilial);
        res.status(200).json({
            Circuits
        });
    } catch (error) {
        next(error);
    }
}

// NUEVO ENDPOINT: Obtener filial por ID (opcional, por si lo necesitas)
const GetFilialById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const filial = await FilialService.getFilialById(id);
        
        if (!filial) {
            return res.status(404).json({ error: 'Filial no encontrada' });
        }
        
        res.status(200).json({
            filial
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
   AllFiliales,
   AllCircuits,
   GetFilialById // Exportar el nuevo endpoint si lo necesitas
}