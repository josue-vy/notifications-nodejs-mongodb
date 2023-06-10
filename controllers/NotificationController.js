const User = require('../models/User');
const Notification = require('../models/Notification');
const rabbitMQManager = require('../rabbitmq');

const exchangeName = 'notifications_exchange';
const routingKey = 'notifications';

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
    const { username, message } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const notification = new Notification({
      user: user._id,
      message,
    });

    await notification.save();

    const populatedNotification = await Notification.findById(notification._id).populate('user');

    // Enviar mensaje a RabbitMQ
    const channel = rabbitMQManager.getChannel();
    const notificationData = { username: populatedNotification.user.username, message };
    const messageBuffer = Buffer.from(JSON.stringify(notificationData));
    channel.publish(exchangeName, routingKey, messageBuffer);

    return res.status(200).json({ message: 'Notificación enviada' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

module.exports = {
  createNotification,
};