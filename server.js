require('dotenv').config(); // Carga variables del archivo .env

const app = require('./src/app'); // Importa la app Express configurada
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});