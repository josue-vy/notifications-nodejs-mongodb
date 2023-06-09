const User = require('../models/User');
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Crea un nuevo usuario con los datos proporcionados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario del nuevo usuario.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del nuevo usuario.
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error de validación de datos.
 *       500:
 *         description: Error en el servidor.
 */
async function createUser(req, res) {
  try {
    // Obtener los datos de la solicitud
    const { username, email } = req.body;

    // Crear un nuevo usuario
    const user = new User({
      username,
      email,
    });

    // Guardar el usuario en la base de datos
    await user.save();

    return res.status(200).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

module.exports = {
  createUser,
};
