
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
