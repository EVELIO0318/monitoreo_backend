const { pingHost } = require('../utils/ping');
const filialModelo = require('../models/filial.model');

const fallosPorFilial = new Map();
const intervalosPorFilial = new Map();

const intervaloPingMs = 4000; // 4 segundos
const intervaloRefrescarMs = 3600000; // 5 minutos

const iniciarMonitoreo = async () => {
  // Función para crear un intervalo de ping para una filial
  const crearIntervaloParaFilial = (filial) => {
    const { IDfilial, direccion_ip } = filial;

    // Si ya existe un intervalo para esta filial, limpiarlo
    if (intervalosPorFilial.has(IDfilial)) {
      clearInterval(intervalosPorFilial.get(IDfilial));
    }

    const intervalo = setInterval(async () => {
      const responde = await pingHost(direccion_ip);
      const fallos = fallosPorFilial.get(IDfilial) || 0;

      if (responde) {
        fallosPorFilial.set(IDfilial, 0);
        await filialModelo.actualizarEstado(IDfilial, 'online');
      } else {
        if (fallos + 1 >= 3) {
          await filialModelo.actualizarEstado(IDfilial, 'offline');
        }
        fallosPorFilial.set(IDfilial, fallos + 1);
      }
      // console.log(`Ping a ${direccion_ip} (${IDfilial}): ${responde ? 'ONLINE' : 'FALLÓ'}`);
    }, intervaloPingMs);

    intervalosPorFilial.set(IDfilial, intervalo);
  };

  // Función para cargar las filiales y actualizar intervalos
  const refrescarFiliales = async () => {
    const filiales = await filialModelo.getFiliales();

    const actualesIDs = new Set(intervalosPorFilial.keys());
    const nuevasIDs = new Set(filiales.map(f => f.IDfilial));

    // Filiales nuevas o con IP modificada: crear o actualizar intervalo
    for (const filial of filiales) {
      crearIntervaloParaFilial(filial);
    }

    // Filiales que ya no existen: limpiar intervalos
    for (const id of actualesIDs) {
      if (!nuevasIDs.has(id)) {
        clearInterval(intervalosPorFilial.get(id));
        intervalosPorFilial.delete(id);
        fallosPorFilial.delete(id);
        console.log(`Intervalo detenido para filial ${id} porque fue eliminada.`);
      }
    }
  };

  // Primera carga y creación de intervalos
  await refrescarFiliales();

  // Refrescar filiales cada 5 minutos
  setInterval(refrescarFiliales, intervaloRefrescarMs);
};

module.exports = { iniciarMonitoreo };
