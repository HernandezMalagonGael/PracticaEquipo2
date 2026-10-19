const asistenciaModelo = require('../Modelo/asistencia_modelo');

function esDuplicado(error) {
    return error.code === 'ER_DUP_ENTRY' || error.code === '23505';
}

async function registrarAsistencia(req, res) {
    try {
        const { usuario_id, taller_id, fecha, estado } = req.body;
        if (!usuario_id || !taller_id) {
            return res.status(400).json({ error: 'usuario_id y taller_id son obligatorios' });
        }
        const asistencia = await asistenciaModelo.registrarAsistencia({ taller_id, usuario_id, fecha, estado });
        res.status(201).json(asistencia);
    } catch (error) {
        if (esDuplicado(error)) {
            return res.status(409).json({ error: 'La asistencia ya está registrada' });
        }
        res.status(500).json({ error: error.message });
    }
}

async function consultarAsistenciaPorTaller(req, res) {
    try {
        const asistencias = await asistenciaModelo.consultarAsistenciaPorTaller(req.params.tallerId);
        res.json(asistencias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { registrarAsistencia, consultarAsistenciaPorTaller };