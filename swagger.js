const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Metadata info about our API
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Notificaciones",
      version: "1.0.0"
    }
  },
  apis: ['./controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app, port) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  console.log(`Swagger Documentation at http://localhost:${port}/api-docs`);
};

module.exports = { swaggerDocs };
