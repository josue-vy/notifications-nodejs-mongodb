const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const rabbitmq = require('./rabbitmq');
const {swaggerDocs} = require('./swagger');

const app = express();
const port = 3000;

rabbitmq.connect();

// Configurar la conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://josue:123.456.789@notifications.dgzjhtw.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión a MongoDB Atlas establecida');
  })
  .catch(error => {
    console.error('Error al conectar a MongoDB Atlas:', error);
  });

// Configurar middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/users', userRoutes);
app.use('/notifications', notificationRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  swaggerDocs(app, port);
});