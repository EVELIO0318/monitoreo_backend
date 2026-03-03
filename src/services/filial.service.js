const Filiales = require('../models/filial.model');

exports.getAllFiliales = async () => {
    const filiales = await Filiales.getFiliales();
    return filiales;
}

exports.getAllCircuits = async (ID) => {
    const circuits = await Filiales.getCircuits(ID);
    return circuits;
}

// NUEVO MÉTODO: Obtener filial por ID
exports.getFilialById = async (idFilial) => {
    const filial = await Filiales.getFilialById(idFilial);
    return filial;
}