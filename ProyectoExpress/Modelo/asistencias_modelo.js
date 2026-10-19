const pool = require('../bd-local');

// Registrar asistencia de un alumno a un taller
async function registrarAsistencia({ taller_id, usuario_id, fecha, estado }) {
    const [info] = await pool.query(
        `INSERT INTO asistencia (taller_id, usuario_id, fecha, estado) VALUES (?, ?, ?, ?)`,
        [taller_id, usuario_id, fecha || new Date(), estado || 'presente']
    );
    
    // Retorna el registro de asistencia recién creado
    const [filas] = await pool.query(
        `SELECT * FROM asistencia WHERE id = ?`,
        [info.insertId]
    );
    return filas[0];
}