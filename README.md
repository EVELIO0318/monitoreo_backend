# 🏖️ Sistema de Monitoreo

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![API REST](https://img.shields.io/badge/API-REST-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

Backend del **Sistema de Monitoreo**, una API REST en **Node.js** que permite supervisar la red de todas las filiales a nivel nacional. Cuando se detecta una caída en la red de alguna filial, el sistema resalta el incidente y facilita el envío de notificaciones automáticas al proveedor con evidencia visual.

---

## 📌 Descripción
Este sistema centraliza el **monitoreo de la conectividad de la red** de cada filial de la empresa.  
Permite identificar rápidamente problemas de red y notificar al proveedor responsable para su resolución inmediata.  

**Funciones principales:**
- Visualización en tiempo real del estado de la red de cada filial.  
- Colores que indican el estado: verde → activo, rojo → caída.  
- Envío automático de correo electrónico con fotos o evidencia al proveedor al detectar una falla.  
- Registro histórico de incidentes para análisis posterior.

---

## 🧠 ¿Cómo funciona?

1. Cada filial está registrada en el sistema con su respectiva red.  
2. El backend monitorea constantemente la conectividad.  
3. Al detectar una caída:
   - Se marca la filial en **rojo** en el panel de control.  
   - Se puede enviar un **correo automático** al proveedor con evidencia.  
4. El sistema mantiene un historial de incidentes y notificaciones enviadas.
---

## 📦 Tecnologías

- **Node.js**  
- **Express.js**  
- **API REST**  
- **Nodemailer** (para envío de correos electrónicos)  
- **JSON** como formato de datos 
---

## 🚀 Instalación
   
   1. **Clonar el repositorio**
   ```bash
  git clone https://github.com/EVELIO0318/monitoreo_backend.git
   
   2. Ir a la carpeta
   cd monitoreo_backend
   
   3. Instalar dependencias
   npm install

  4. Importar la Base de datos MYSQL en tu gestor
   
   5. Configurar variables de entorno
   Crea un archivo .env con las siguientes variables:
  DB_HOST= <TU IP DEL SERVIDOR>
  DB_USER=<TU USUARIO>
  DB_PASSWORD=<TU CONTRASEÑA>
  DB_NAME=monitoreo
  PORT=3003
  JWT_SECRET=Temporal
  EMAIL_FROM=<COLOCHA UN CORREO DE HOTMAIL U OUTLOOK>
  PASS_EMAIL= <Tu contraseña>

   
   5. Iniciar el servidor
   nodemon app.js
   
   por defecto se levanta en: http://localhost:3000
 ```

---

## 👨‍💻 Autor
Ing. Evelio Escobar
📌 Ingeniero en Sistemas y Docente Bilingüe
✈️ Apasionado por los viajes y la tecnología


📧 Contacto
Evelio Escobar
📩 evelio.villeda9@gmail.com

¡Gracias por visitar este proyecto! 🚀
