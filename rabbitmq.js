const amqp = require('amqplib');

class RabbitMQManager {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      const rabbitSettings = {
        protocol: 'amqp',
        hostname: 'localhost',
        port: 5672,
        username: 'jona',
        password: 'jona',
        vhost: '/',
        authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
      };

      const url = `${rabbitSettings.protocol}://${rabbitSettings.username}:${rabbitSettings.password}@${rabbitSettings.hostname}:${rabbitSettings.port}${rabbitSettings.vhost}`;
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      // Configurar la cola y el intercambio
      const queueName = 'notifications_queue';
      const exchangeName = 'notifications_exchange';

      await this.channel.assertQueue(queueName, { durable: true });
      await this.channel.assertExchange(exchangeName, 'direct', { durable: true });
      await this.channel.bindQueue(queueName, exchangeName, 'notifications');

      console.log('Conexión exitosa con RabbitMQ');
    } catch (error) {
      console.error('Error al establecer conexión con RabbitMQ:', error);
      throw error;
    }
  }
  async consumeMessages(queueName) {
    try {
      const handleMessage = async (msg) => {
        const message = JSON.parse(msg.content.toString());
        console.log('Mensaje recibido:', message);
        // Aquí puedes agregar la lógica para procesar el mensaje recibido

        this.channel.ack(msg);
      };

      await this.channel.consume(queueName, handleMessage);

    } catch (error) {
      console.error('Error al consumir mensajes:', error);
      throw error;
    }
  }

  getChannel() {
    if (!this.channel) {
      throw new Error('La conexión a RabbitMQ no ha sido establecida');
    }
    return this.channel;
  }
}

const rabbitMQManager = new RabbitMQManager();

module.exports = rabbitMQManager;