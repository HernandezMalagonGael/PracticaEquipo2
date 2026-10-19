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

// Consultar todas las asistencias de un taller específico
async function consultarAsistenciaPorTaller(taller_id) {
    const [filas] = await pool.query(
        `SELECT a.id, a.taller_id, a.usuario_id, u.nombre, u.boleta, u.correo, a.fecha, a.estado
         FROM asistencia a
         JOIN usuarios u ON a.usuario_id = u.id
         WHERE a.taller_id = ?
         ORDER BY a.fecha DESC`,
        [taller_id]
    );
    return filas;
}

module.exports = {
    registrarAsistencia,
    consultarAsistenciaPorTaller
};