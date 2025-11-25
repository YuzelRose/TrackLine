import Tabloid from '../models/tabloid/TabloidModel.js';
import Profesor from '../models/user/ProfesorModel.js';

// CREATE - Crear un nuevo tabloide y vincularlo al profesor
export const create = async (req, res) => {
    try {
        const { data } = req.body;
        
        console.log(' POST /crudTablo/tabloids - Creando nuevo tabloide:', data);
        
        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Sin información en el cuerpo de la petición'
            });
        }

        // Validar campos requeridos
        const requiredFields = ['Name', 'Owner', 'description'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Faltan campos requeridos: ${missingFields.join(', ')}`
            });
        }

        // Verificar si el profesor existe
        const profesor = await Profesor.findById(data.Owner);
        
        if (!profesor) {
            return res.status(404).json({
                success: false,
                message: 'Profesor no encontrado'
            });
        }

        // Verificar si ya existe un tabloide con el mismo nombre para este profesor
        const existingTabloid = await Tabloid.findOne({ 
            Name: data.Name,
            Owner: data.Owner 
        });
        
        if (existingTabloid) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un tabloide con este nombre para el profesor'
            });
        }

        // Crear el tabloide
        const tabloidData = {
            Name: data.Name,
            Owner: data.Owner,
            description: data.description,
            HomeWork: data.HomeWork || [],
            requiredPayment: data.requiredPayment || []
        };

        const newTabloid = new Tabloid(tabloidData);
        const savedTabloid = await newTabloid.save();

        // Generar NTabloid único
        const NTabloid = 'TAB' + savedTabloid._id.toString().slice(-6).toUpperCase();

        // Actualizar el profesor con el nuevo tabloide
        await Profesor.findByIdAndUpdate(
            data.Owner,
            { 
                $push: { 
                    Tabloid: { 
                        NTabloid: NTabloid,
                        TabloidId: savedTabloid._id
                    } 
                } 
            }
        );

        // Poblar la información del propietario en la respuesta
        const populatedTabloid = await Tabloid.findById(savedTabloid._id)
            .populate('Owner', 'Name Email UserType RFC NCount');

        console.log(' Tabloide creado exitosamente:', populatedTabloid._id);
        
        res.status(201).json({
            success: true,
            message: 'Tabloide creado exitosamente',
            data: populatedTabloid
        });
        
    } catch (error) {
        console.error(' Error al crear tabloide:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear tabloide',
            error: error.message
        });
    }
};

// READ - Obtener todos los tabloides con información del profesor
export const getAll = async (req, res) => {
    try {
        console.log(' GET /crudTablo/tabloids - Solicitando todos los tabloides');
        
        const tabloids = await Tabloid.find()
            .populate('Owner', 'Name Email UserType RFC NCount')
            .populate('HomeWork.notice')
            .populate('HomeWork.assigment')
            .populate('requiredPayment');
        
        console.log('Encontrados ' + tabloids.length + ' tabloides');
        
        res.status(200).json({
            success: true,
            data: tabloids
        });
        
    } catch (error) {
        console.error(' Error en GET /crudTablo/tabloids:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener tabloides',
            error: error.message
        });
    }
};

// READ - Obtener tabloide por ID
export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(' GET /crudTablo/tabloids/' + id + ' - Solicitando tabloide por ID');
        
        const tabloid = await Tabloid.findById(id)
            .populate('Owner', 'Name Email UserType RFC NCount')
            .populate('HomeWork.notice')
            .populate('HomeWork.assigment')
            .populate('requiredPayment');
        
        if (!tabloid) {
            return res.status(404).json({
                success: false,
                message: 'Tabloide no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: tabloid
        });
        
    } catch (error) {
        console.error(' Error en GET /crudTablo/tabloids/' + id + ':', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener tabloide',
            error: error.message
        });
    }
};

// READ - Obtener todos los profesores para selectores
export const getProfesors = async (req, res) => {
    try {
        console.log(' GET /crudTablo/profesors - Solicitando lista de profesores');
        
        const profesors = await Profesor.find()
            .select('Name Email _id RFC NCount')
            .sort({ Name: 1 });
        
        console.log('Encontrados ' + profesors.length + ' profesores');
        
        res.status(200).json({
            success: true,
            data: profesors
        });
        
    } catch (error) {
        console.error(' Error en GET /crudTablo/profesors:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener profesores',
            error: error.message
        });
    }
};

// DELETE - Eliminar tabloide por ID
export const deleteTabloid = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(' DELETE /crudTablo/tabloids/' + id + ' - Eliminando tabloide');
        
        const tabloid = await Tabloid.findById(id);
        
        if (!tabloid) {
            return res.status(404).json({
                success: false,
                message: 'Tabloide no encontrado'
            });
        }

        // Remover la referencia del tabloide en el profesor
        await Profesor.findByIdAndUpdate(
            tabloid.Owner,
            { 
                $pull: { 
                    Tabloid: { TabloidId: tabloid._id } 
                } 
            }
        );

        // Eliminar el tabloide
        await Tabloid.findByIdAndDelete(id);
        
        console.log(' Tabloide eliminado exitosamente:', id);
        
        res.status(200).json({
            success: true,
            message: 'Tabloide eliminado exitosamente'
        });
        
    } catch (error) {
        console.error(' Error en DELETE /crudTablo/tabloids/' + id + ':', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar tabloide',
            error: error.message
        });
    }
};

// UPDATE - Actualizar tabloide por ID
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body.data || req.body;

        console.log(' PUT /crudTablo/tabloids/' + id + ' - Actualizando tabloide:', updateData);

        // Buscar el tabloide primero
        const existingTabloid = await Tabloid.findById(id);
        
        if (!existingTabloid) {
            return res.status(404).json({
                success: false,
                message: 'Tabloide no encontrado'
            });
        }

        // Si se está cambiando el Owner, verificar que el nuevo owner sea un profesor
        if (updateData.Owner && updateData.Owner !== existingTabloid.Owner.toString()) {
            const newProfesor = await Profesor.findById(updateData.Owner);
            
            if (!newProfesor) {
                return res.status(404).json({
                    success: false,
                    message: 'El nuevo propietario no es un profesor válido'
                });
            }

            // Remover referencia del profesor anterior
            await Profesor.findByIdAndUpdate(
                existingTabloid.Owner,
                { 
                    $pull: { 
                        Tabloid: { TabloidId: existingTabloid._id } 
                    } 
                }
            );

            // Agregar referencia al nuevo profesor
            await Profesor.findByIdAndUpdate(
                updateData.Owner,
                { 
                    $push: { 
                        Tabloid: { 
                            NTabloid: 'TAB' + existingTabloid._id.toString().slice(-6).toUpperCase(),
                            TabloidId: existingTabloid._id
                        } 
                    } 
                }
            );
        }

        // Si se está cambiando el nombre, verificar que no exista otro con el mismo nombre para el mismo profesor
        const ownerId = updateData.Owner || existingTabloid.Owner;
        if (updateData.Name && updateData.Name !== existingTabloid.Name) {
            const existingName = await Tabloid.findOne({
                Name: updateData.Name,
                Owner: ownerId,
                _id: { $ne: id }
            });
            
            if (existingName) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un tabloide con este nombre para el profesor'
                });
            }
        }

        // Actualizar el tabloide
        const updatedTabloid = await Tabloid.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).populate('Owner', 'Name Email UserType RFC NCount')
         .populate('HomeWork.notice')
         .populate('HomeWork.assigment')
         .populate('requiredPayment');

        console.log(' Tabloide actualizado exitosamente:', updatedTabloid._id);
        
        res.status(200).json({
            success: true,
            message: 'Tabloide actualizado exitosamente',
            data: updatedTabloid
        });
        
    } catch (error) {
        console.error(' Error en PUT /crudTablo/tabloids/' + id + ':', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar tabloide',
            error: error.message
        });
    }
};