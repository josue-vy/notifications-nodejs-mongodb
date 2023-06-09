const amqp = require('amqplib');

const rabbitSettings = {
  protocol: 'amqp',
  hostname: 'localhost',
  port: 5672,
  username: 'jona',
  password: 'jona',
  vhost: '/',
  authMechanism: ['PLAIN','AMQPLAIN','EXTERNAL']
};

async function connect() {
  try {
    const url = `${rabbitSettings.protocol}://${rabbitSettings.username}:${rabbitSettings.password}@${rabbitSettings.hostname}:${rabbitSettings.port}${rabbitSettings.vhost}`;
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    // Configurar la cola y el intercambio
    const queueName = 'notifications_queue';
    const exchangeName = 'notifications_exchange';

    await channel.assertQueue(queueName, { durable: true });
    await channel.assertExchange(exchangeName, 'direct', { durable: true });
    await channel.bindQueue(queueName, exchangeName, 'notifications');

    // Consumir mensajes de la cola
    channel.consume(queueName, (msg) => {
      const notification = JSON.parse(msg.content.toString());

      // Procesar la notificación aquí, por ejemplo, enviar un correo electrónico o una notificación push

      console.log('Notificación recibida:', notification);

      channel.ack(msg); // Confirmar el procesamiento del mensaje
    });

    console.log('Conexión exitosa con RabbitMQ');
  } catch (error) {
    console.error('Error al establecer conexión con RabbitMQ:', error);
  }
}

module.exports = {
  connect
};
