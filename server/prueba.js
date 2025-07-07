const db = require("./database/db");
require("dotenv").config();

async function testDB() {
  try {
    const [rows] = await db.query("SELECT * FROM uea LIMIT 1");

    if (rows.length === 0) {
      console.log("La tabla 'uea' está vacía.");
    } else {
      console.log("Conexión exitosa. Primera fila:", rows[0]);
    }
  } catch (error) {
    console.error("Error de conexión:", error.message);
  }
}
  

testDB();
