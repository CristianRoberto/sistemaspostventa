const bcrypt = require('bcrypt'); // Para comparar contraseñas cifradas
const Usuario = require('../models/usuario'); // Importa correctamente el modelo de Usuario

const Empleado = require('../models/empleado'); // Importa correctamente el modelo de Usuario
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        // Buscar usuario por correo
        const usuario = await Usuario.findOne({ where: { correo } });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Comparar las contraseñas
        const contraseñaValida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!contraseñaValida) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Crear JWT
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, 'secretKey', { expiresIn: '1h' });

        // Responder con el token y los datos del usuario
        return res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre_usuario,
                correo: usuario.correo,
                rol: usuario.rol,
                empleado_id: usuario.empleado_id || '',
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
};





const registerController = async (req, res) => {
    const { cedula, nombre_usuario, correo, rol, contrasena, estado } = req.body;
    const estadoFinal = estado || 'activo';

    if (!cedula || !nombre_usuario || !correo || !rol || !contrasena || !estadoFinal) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const cedulaRegex = /^[0-9]{10}$/;
    if (!cedulaRegex.test(cedula)) {
        return res.status(400).json({ error: 'La cédula debe ser un número de 10 dígitos' });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ error: 'El correo electrónico no tiene un formato válido' });
    }

    if (contrasena.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    try {
        // Verificar si la cédula o el correo ya están registrados
        const usuarioExistente = await Usuario.findOne({ where: { cedula } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'La cédula ya está registrada' });
        }

        const correoExistente = await Usuario.findOne({ where: { correo } });
        if (correoExistente) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Verificar si el empleado existe
        const empleado = await Empleado.findOne({ where: { cedula } });
        const empleadoId = empleado ? empleado.empleado_id : null;

        // Cifrar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // Crear el nuevo usuario
        const nuevoUsuario = await Usuario.create({
            cedula,
            nombre_usuario,
            correo,
            rol,
            contrasena: hashedPassword,
            estado: estadoFinal,
            empleado_id: empleadoId,
        });

        return res.status(201).json({
            success: true,
            message: 'Usuario creado con éxito',
            usuario: {
                id_usuario: nuevoUsuario.id_usuario,
                cedula: nuevoUsuario.cedula,
                nombre_usuario: nuevoUsuario.nombre_usuario,
                correo: nuevoUsuario.correo,
                rol: nuevoUsuario.rol,
                estado: nuevoUsuario.estado,
                fecha_creacion: nuevoUsuario.fecha_creacion,
                empleado_id: nuevoUsuario.empleado_id,
            }
        });

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        return res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};




const obtenerRegister = async (req, res) => {
    try {
        console.log('Solicitud de obtener Usuarios recibida');  // Mensaje inicial para verificar si la solicitud llega

        const Usuarios = await Usuario.findAll({
            include: [
                {
                    model: Empleado,
                    as: 'empleado',  // Si usas alias, debes agregarlo aquí
                    required: true
                }
            ]
        });
        console.log('Usuarios obtenidas:', Usuarios);  // Para ver qué datos devuelve la consulta
        return res.status(200).json(Usuarios);
    } catch (error) {
        console.error('Error al obtener Usuarios:', error);  // Imprime el error en caso de que ocurra algo en el try
        return res.status(500).json({ error: 'Error al obtener las Usuarios' });
    }
};
module.exports = { login, registerController, obtenerRegister };
