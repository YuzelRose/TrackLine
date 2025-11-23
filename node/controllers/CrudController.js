import User from '../models/user/UserModel.js'
import Student from '../models/user/StudentModel.js'
import Tutor from '../models/user/TutorModel.js'
import Profesor from '../models/user/ProfesorModel.js'
import Content from '../models/tabloid/ContentModel.js'
import Tabloid from '../models/tabloid/TabloidModel.js'
import Notice from '../models/tabloid/NoticeModel.js';
import Assigment from '../models/tabloid/AssigmentModel.js';
import Content from '../models/tabloid/ContentModel.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
export const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
const genTok = () => crypto.randomBytes(32).toString('hex');

//const salt = await bcrypt.genSalt(10); para hasheo
//await bcrypt.hash(dato, salt),

