import Autor from "../models/ProfesorModel.js";

export const getAutores = async (req, res) => {
    try {
        const autores = await Autor.find(); 
        res.json(autores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAutorById = async (req, res) => {
    try {
        const autor = await Autor.findById(req.params.id);
        if (!autor) return res.status(404).json({ message: 'Autor no encontrado' });
        res.json(autor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAutorByName = async (req, res) => {
    try {
        const { Name } = req.params;
        const autores  = await Autor.find({
            Nombre: { $regex: Name, $options: 'i' }
        });

        if (autores.length === 0) {
            return res.status(404).json({ message: 'No se encontraron autores' });
        }
        res.json(autores);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getExactAutorByName = async (req, res) => {
    try {
        const { Name } = req.params;
        const autores = await Autor.find({
            Nombre: Name
        });

        if (autores.length === 0) {
            return res.status(404).json({ message: 'No se encontraron autores' });
        }

        res.json(autores);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const DropAutor = async (req, res) => {
    try {
        const autor = await Autor.findById(req.params.id);
        if (!autor) return res.status(404).json({ message: 'Autor no encontrado' });
        await Autor.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Autor eliminado exitosamente' });
    } catch(error) {
        res.status(500).json({ message: error.message });   
    }
};

export const ChangeAutor = async (req, res) => {
    try {
        const { nombre, resumen, image } = req.body;
        const autor = await Autor.findById(req.params.id); 
        if (!autor) return res.status(404).json({ message: "Autor no encontrado" });
        if (nombre) autor.Nombre = nombre;
        if (resumen) autor.Resumen = resumen;
        if (image) autor.URLImage = image;
        await autor.save();
        res.status(200).json({ message: "Autor actualizado correctamente", autor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSearchAutors = async (req, res) => {
    try {
        const { name } = req.body;
        const filters = {}; 
        if (name) filters.Nombre = { $regex: name, $options: 'i' }; 

        const autores = await Autor.find(filters);
        if (autores.length === 0) return res.status(404).json({ message: 'Autor no encontrado' });

        res.json(autores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

