import { query } from '../config/db.js';

// Buscar un usuario por email
export const findUserByEmail = async (email) => {
  const result = await query(
    'SELECT id, nombre, email, password FROM usuarios WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

// Insertar un nuevo usuario en la base de datos
export const createUser = async ({ nombre, email, password }) => {
  const result = await query(
    `INSERT INTO usuarios (nombre, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, nombre, email, creado_en`,
    [nombre, email, password]
  );
  return result.rows[0];
};