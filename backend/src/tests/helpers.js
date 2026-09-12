import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

export const USUARIO_TEST_1_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10";
export const USUARIO_TEST_2_ID = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23";

export const generarTokenTest = (usuarioId = USUARIO_TEST_1_ID) => {
  return jwt.sign(
    { id: usuarioId, email: "test@example.com" },
    process.env.JWT_SECRET || "secreto_test",
    { expiresIn: "1h" },
  );
};

export const tokenExpirado = jwt.sign(
  { id: "00000000-0000-0000-0000-000000000000" },
  process.env.JWT_SECRET || "secreto_test",
  { expiresIn: "1h" },
);

export const limpiarBaseDeDatos = async () => {
  await query("TRUNCATE TABLE facturas, servicios, usuarios RESTART IDENTITY CASCADE");
  await query(
    `INSERT INTO usuarios (id, nombre, email, password) VALUES 
     ($1, 'Usuario Test 1', 'test1@example.com', 'hash_ficticio_1'),
     ($2, 'Usuario Test 2', 'test2@example.com', 'hash_ficticio_2')
     ON CONFLICT (id) DO NOTHING`,
    [USUARIO_TEST_1_ID, USUARIO_TEST_2_ID]
  );  
};
