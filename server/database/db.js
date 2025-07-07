require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const formato = require("./formato");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 8080,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "dominius",
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
});

async function findOrCreateUser(nombre, correo) {
  const [rows] = await pool.query("SELECT * FROM usuario WHERE correo = ?", [
    correo,
  ]);

  if (rows.length) return formato(rows[0]); // Usuario ya existe

  const [result] = await pool.query(
    "INSERT INTO usuario (nombre, correo) VALUES (?, ?)",
    [nombre, correo]
  );

  // Volver a consultar para obtener todos los campos, incluido fecha_registro
  const [newUserRows] = await pool.query("SELECT * FROM usuario WHERE id = ?", [
    result.insertId,
  ]);

  return formato(newUserRows[0]);
}

async function getUserById(id) {
  const [rows] = await pool.query("SELECT * FROM usuario WHERE id = ?", [id]);
  return rows[0];
}

async function findOrCreateUea(nombre) {
  const [rows] = await pool.query("SELECT * FROM uea WHERE nombre = ?", [
    nombre,
  ]);
  if (rows.length) return rows[0];
  const [result] = await pool.query("INSERT INTO uea(nombre) VALUES (?)", [
    nombre,
  ]);
  return { id: result.insertId, nombre };
}

async function findOrCreateUsuarioUea(usuarioId, ueaId) {
  const [rows] = await pool.query(
    "SELECT * FROM usuario_uea WHERE usuario_id = ? AND uea_id = ?",
    [usuarioId, ueaId]
  );
  if (rows.length) return rows[0];
  const [result] = await pool.query(
    "INSERT INTO usuario_uea(usuario_id, uea_id) VALUES (?, ?)",
    [usuarioId, ueaId]
  );
  return { id: result.insertId, usuario_id: usuarioId, uea_id: ueaId };
}

async function addNotaCornell(usuarioUeaId, ideas, notas, resumen) {
  await pool.query(
    "INSERT INTO nota_cornell(usuario_uea_id, ideas_clave, notas_principales, resumen) VALUES (?, ?, ?, ?)",
    [usuarioUeaId, ideas, notas, resumen]
  );
}

module.exports = {
  pool,
  findOrCreateUser,
  findOrCreateUea,
  findOrCreateUsuarioUea,
  addNotaCornell,
  getUserById,
};
