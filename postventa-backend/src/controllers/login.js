const bcrypt = require('bcrypt'); // Para comparar contraseñas cifradas
const Usuario = require('../models/usuario'); // Importa correctamente el modelo de Usuario

const Empleado = require('../models/empleado'); // Importa correctamente el modelo de Usuario

const login = async (req, res) => {
    console.log('🔹 Se recibió una solicitud de login');
    console.log('📩 Datos recibidos:', req.body);

    const { correo, contrasena } = req.body;

    try {
        console.log('🔍 Buscando usuario con correo:', correo);
        const usuario = await Usuario.findOne({ where: { correo } });

        if (!usuario) {
            console.warn('⚠️ Usuario no encontrado');
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        console.log('✅ Usuario encontrado:', usuario);

        // Verificar la contraseña
        console.log('🔑 Comparando contraseñas...');
        const contraseñaValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!contraseñaValida) {
            console.warn('⚠️ Contraseña incorrecta');
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        console.log('🔓 Contraseña válida, iniciando sesión...');

        // Responder con los datos del usuario (sin la contraseña)
        const respuesta = {
            success: true,
            message: 'Inicio de sesión exitoso',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                fecha_creacion: usuario.fecha_creacion
            }
        };

        console.log('📤 Respuesta enviada:', respuesta);
        return res.status(200).json(respuesta);

    } catch (error) {
        console.error('❌ Error en el login:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
};





const registerController = async (req, res) => {
    const { cedula, nombre_usuario, correo, rol, contrasena, estado } = req.body;
    console.log('datos recibidos en resgitro', req.body);

      // Si no se proporciona el estado, se asigna "activo" por defecto
      const estadoFinal = estado || 'activo';
      console.log('Estado asignado:', estadoFinal);


    // Validación de campos obligatorios
    if (!cedula || !nombre_usuario || !correo || !rol || !contrasena || !estadoFinal) {
        console.log('Error: Faltan campos obligatorios');
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    console.log('Campos recibidos:', { cedula, nombre_usuario, correo, rol, contrasena, estadoFinal });

    // Validación del formato de la cédula (por ejemplo, solo números)
    const cedulaRegex = /^[0-9]{10}$/; // Ajusta esto a la longitud y formato de tu cédula
    if (!cedulaRegex.test(cedula)) {
        console.log('Error: La cédula tiene un formato inválido');
        return res.status(400).json({ error: 'La cédula debe ser un número de 10 dígitos' });
    }

    // Validación de correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(correo)) {
        console.log('Error: El correo tiene un formato inválido');
        return res.status(400).json({ error: 'El correo electrónico no tiene un formato válido' });
    }

    // Validación de la contraseña (por ejemplo, debe tener al menos 8 caracteres)
    if (contrasena.length < 8) {
        console.log('Error: La contraseña tiene menos de 8 caracteres');
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    // Validación del rol (debe ser uno de los roles permitidos)
    const rolesPermitidos = ['admin', 'empleado', 'supervisor', 'cajero']; // Ajusta los roles según tu necesidad
    if (!rolesPermitidos.includes(rol)) {
        console.log('Error: El rol especificado no es válido');
        return res.status(400).json({ error: 'El rol especificado no es válido' });
    }

    try {
        // Buscar si el correo ya está registrado
        const usuarioExistente = await Usuario.findOne({ where: { correo } });
        if (usuarioExistente) {
            console.log(`Error: El correo ${correo} ya está registrado`);
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }
        console.log('Correo no registrado. Continuando...');

        // Buscar si el empleado existe por cédula
        const empleado = await Empleado.findOne({ where: { cedula } });
        if (empleado) {
            console.log(`Empleado encontrado: ${empleado.id_empleado}`);
        } else {
            console.log('Empleado no encontrado');
        }

        // Asignar el ID del empleado si existe
        const empleadoId = empleado ? empleado.id_empleado : null;
        console.log('ID del empleado:', empleadoId);

        // Cifrar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
        console.log('Contraseña cifrada:', hashedPassword);

        // Crear el nuevo usuario
        const nuevoUsuario = await Usuario.create({
            cedula,
            nombre_usuario,
            correo,
            rol,
            contrasena: hashedPassword, // Guardar la contraseña cifrada
            estado,
            empleado_id: empleadoId, // Si no existe, será NULL
        });
        console.log('Nuevo usuario creado:', nuevoUsuario);

        // Responder con el nuevo usuario (sin la contraseña)
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
