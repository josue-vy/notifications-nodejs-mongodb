const amqp = require('amqplib');
const User = require('../models/User');
const Notification = require('../models/Notification');

const QUEUE_NAME = 'notification_queue';

// Configurar la conexión a RabbitMQ
async function setupRabbitMQConnection() {
  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  return channel;
}
/**
 * @swagger
 * /api/notification:
 *   post:
 *     summary: Crear una nueva notificación
 *     tags:
 *       - Notificaciones
 *     requestBody:
 *       description: Datos de la notificación
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notificación creada exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
// Controlador para crear una nueva notificación
async function createNotification(req, res) {
  try {
    // Obtener los datos de la solicitud
    const { username, message } = req.body;

    // Buscar el usuario en la base de datos
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear una nueva notificación
    const notification = new Notification({
      user: user._id, // Guardar la referencia al usuario
      message,
    });

    // Guardar la notificación en la base de datos
    await notification.save();

    // Poblar el campo 'user' con los datos del usuario
    const populatedNotification = await Notification.findById(notification._id).populate('user');

    // Publicar el mensaje en RabbitMQ
    const channel = await setupRabbitMQConnection();
    const notificationData = { username: populatedNotification.user.username, message };
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(notificationData)), { persistent: true });

    return res.status(200).json({ message: 'Notificación enviada' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

module.exports = {
  createNotification,
};
