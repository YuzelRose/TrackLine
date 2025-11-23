import Content from '../models/tabloid/ContentModel.js'

export const getFile = async (req, res) => {
    try {
        const { contentId } = req.params;

        const content = await Content.findById(contentId);
        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Archivo no encontrado'
            });
        }

        res.set({
            'Content-Type': content.contentType || 'application/octet-stream',
            'Content-Disposition': `inline; filename="${content.Name}"`,
            'Content-Length': content.data.length
        });

        res.send(content.data);

    } catch (error) {
        console.error('Error obteniendo archivo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el archivo'
        });
    }
};

export const downloadFile = async (req, res) => {
    try {
        const { contentId } = req.params;
        
        const content = await Content.findById(contentId);
        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Archivo no encontrado'
            });
        }
        console.log(`descargando archivo: ${content.Name}`)
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${content.Name}"`,
            'Content-Length': content.data.length
        });

        res.send(content.data);

    } catch (error) {
        console.error('Error descargando archivo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al descargar el archivo'
        });
    }
};