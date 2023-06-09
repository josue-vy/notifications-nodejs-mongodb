const express = require('express');
const NotificationController = require('../controllers/NotificationController');

const router = express.Router();

// Ruta para crear una nueva notificación
router.post('/', NotificationController.createNotification);

module.exports = router;
