const crypto = require("crypto");
const pool = require("../bd-local");

// Columnas del taller + cuántos alumnos llevan registrados y cuántos lugares quedan
const SELECT_TALLER = `
    SELECT t.id, t.nombre, t.instructor, t.fecha, t.cupo,
           COUNT(a.id) AS inscritos,
           t.cupo - COUNT(a.id) AS lugares_disponibles
    FROM talleres t
    LEFT JOIN asistencias a ON a.taller_id = t.id`;

const GROUP_TALLER = `GROUP BY t.id, t.nombre, t.instructor, t.fecha, t.cupo`;

// Consultar todos los talleres
async function consultarTodos() {
  const [filas] = await pool.query(
    `${SELECT_TALLER} ${GROUP_TALLER} ORDER BY t.fecha, t.nombre`,
  );
  return filas;
}

// Obtener un taller por id (undefined si no existe)
async function obtenerPorId(id) {
  const [filas] = await pool.query(
    `${SELECT_TALLER} WHERE t.id = ? ${GROUP_TALLER}`,
    [id],
  );
  return filas[0];
}

// Registrar a un alumno en un taller
async function registrarAlumno({ taller_id, nombre_alumno, boleta }) {
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

  // La tabla no tiene UNIQUE (taller_id, boleta), lo revisa aquí
  const [repetido] = await pool.query(
    `SELECT id FROM asistencias WHERE taller_id = ? AND boleta = ?`,
    [taller_id, boleta],
  );
  if (repetido.length > 0) {
    const error = new Error("El alumno ya está registrado en este taller");
    error.code = "ALUMNO_YA_REGISTRADO";
    throw error;
  }

  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO asistencias (id, taller_id, nombre_alumno, boleta) VALUES (?, ?, ?, ?)`,
    [id, taller_id, nombre_alumno, boleta],
  );

  const [filas] = await pool.query(
    `SELECT id, taller_id, nombre_alumno, boleta, fecha_registro FROM asistencias WHERE id = ?`,
    [id],
  );
  return filas[0];
}

module.exports = { consultarTodos, obtenerPorId, registrarAlumno };
