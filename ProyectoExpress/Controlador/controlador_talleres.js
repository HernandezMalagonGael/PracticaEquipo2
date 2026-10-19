
// Talleres
const talleres = [
    { id: 1, nombre: "Introducción a Python", instructor: "María López", cupo: 25, inscritos: 25 },
    { id: 2, nombre: "Redes y Chompus", instructor: "Juan Pérez", cupo: 30, inscritos: 18 },
    { id: 3, nombre: "Por qué no me alcanza para el nuevo Zelda", instructor: "Ana Gómez", cupo: 20, inscritos: 15 }
];

// 1. Para btener todos los talleres 
const obtenerTalleres = (req, res) => {
    try {
        
        return res.status(200).json({
            exito: true,
            mensaje: "Lista de talleres obtenida correctamente",
            datos: talleres
        });
    } catch (error) {
        return res.status(500).json({ exito: false, mensaje: "Error al obtener los talleres", error: error.message });
    }
};

// 2. Los nombres de los talleres 
const obtenerNombres = (req, res) => {
    const nombres = talleres.map(taller => taller.nombre);
    return res.status(200).json({ exito: true, datos: nombres });
};

// 3. Filtrar talleres con cupo lleno 
const obtenerTalleresLlenos = (req, res) => {
    const llenos = talleres.filter(taller => taller.inscritos >= taller.cupo);
    return res.status(200).json({ exito: true, datos: llenos });
};

// 4. Buscar taller por instructor
const buscarPorInstructor = (req, res) => {
    // Supone que recibes el nombre del instructor por los parámetros de la ruta (ej. /talleres/instructor/:nombre)
    const nombreBuscado = req.params.nombre || "";
    const encontrado = talleres.find(taller => 
        taller.instructor.toLowerCase().includes(nombreBuscado.toLowerCase())
    );

    if (!encontrado) {
        return res.status(404).json({ exito: false, mensaje: "No se encontró ningún taller con ese instructor" });
    }

    return res.status(200).json({ exito: true, datos: encontrado });
};

// 5. Total de alumnos inscritos en total
const calcularTotalAlumnos = (req, res) => {
    const total = talleres.reduce((acumulador, taller) => acumulador + taller.inscritos, 0);
    return res.status(200).json({ exito: true, totalInscritos: total });
};

// 6. Talleres con cupo disponible
const obtenerDisponibles = (req, res) => {
    const disponibles = talleres
        .filter(taller => taller.inscritos < taller.cupo)
        .map(taller => ({
            nombre: taller.nombre,
            lugaresLibres: taller.cupo - taller.inscritos
        }));

    return res.status(200).json({ exito: true, datos: disponibles });
};

// Exportar las funciones para usarlas en las rutas de Express
module.exports = {
    obtenerTalleres,
    obtenerNombres,
    obtenerTalleresLlenos,
    buscarPorInstructor,
    calcularTotalAlumnos,
    obtenerDisponibles
};