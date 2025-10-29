import Registro from "../models/RegisterModels.js";

export const postSubscribe = async (req, res) => {
    const { Mail } = req.body; 
    if (!Mail) return res.status(400).json({ message: 'Datos vacios' }); 
    try {
        const newSub = new Registro({
            Mail: Mail, 
        });
        const saveSub = await newSub.save();
        res.status(201).json(saveSub);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
