const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/', UserController.createUser);

module.exports = router;
