const pool = require("../bd-local");

// Consultar todos los talleres (incluye cuántos alumnos llevan inscritos y cuántos lugares quedan)
async function consultarTodos() {
  const [filas] = await pool.query(
    `SELECT t.id, t.nombre, t.instructor, t.cupo,
                COUNT(i.id) AS inscritos,
                t.cupo - COUNT(i.id) AS lugares_disponibles
         FROM talleres t
         LEFT JOIN inscripciones i ON i.taller_id = t.id
         GROUP BY t.id, t.nombre, t.instructor, t.cupo
         ORDER BY t.id`,
  );
  return filas;
}

// Obtener un taller por id (undefined si no existe)
async function obtenerPorId(id) {
  const [filas] = await pool.query(
    `SELECT t.id, t.nombre, t.instructor, t.cupo,
                COUNT(i.id) AS inscritos,
                t.cupo - COUNT(i.id) AS lugares_disponibles
         FROM talleres t
         LEFT JOIN inscripciones i ON i.taller_id = t.id
         WHERE t.id = ?
         GROUP BY t.id, t.nombre, t.instructor, t.cupo`,
    [id],
  );
  return filas[0];
}

// Registrar (inscribir) a un alumno en un taller
async function registrarAlumno({ taller_id, usuario_id }) {
  const taller = await obtenerPorId(taller_id);

  if (!taller) {
    const error = new Error("Taller no encontrado");
    error.code = "TALLER_NO_ENCONTRADO";
    throw error;
  }

  if (taller.inscritos >= taller.cupo) {
    const error = new Error("El taller ya no tiene cupo disponible");
    error.code = "TALLER_LLENO";
    throw error;
  }

  // Si el alumno ya estaba inscrito, MySQL lanza ER_DUP_ENTRY (requiere UNIQUE en taller_id + usuario_id)
  const [info] = await pool.query(
    `INSERT INTO inscripciones (taller_id, usuario_id) VALUES (?, ?)`,
    [taller_id, usuario_id],
  );

  const [filas] = await pool.query(
    `SELECT id, taller_id, usuario_id FROM inscripciones WHERE id = ?`,
    [info.insertId],
  );
  return filas[0];
}

module.exports = { consultarTodos, obtenerPorId, registrarAlumno };
