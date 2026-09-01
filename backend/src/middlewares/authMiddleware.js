import jwt from 'jsonwebtoken';
import { query } from '../db.js';

// Validación de token JWT para proteger rutas
const protegerRuta = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        const error = new Error("No autorizado, no se proporcionó un token.");
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);

        const result = await query(
          "SELECT id, email FROM usuarios WHERE id = $1",
          [decodificado.id],
        );

        const usuario = result.rows[0];

        if(!usuario) {
            const error = new Error("El usuario de este token ya no existe.");
            error.statusCode = 401;
            return next(error);
        }

        req.usuario = usuario;
        next()
    } catch (error) {
        error.message = "No autorizado, token inválido o expirado.";
        error.statusCode = 401;
        next(error);
    }
};

export default protegerRuta;