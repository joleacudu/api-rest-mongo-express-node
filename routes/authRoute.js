import express from 'express';
import { login, register } from '../controllers/authController.js';
import { body } from 'express-validator';
import { validationResultGlobal } from '../middlewares/validationResultGlobal.js';

const router = express.Router();

router.post('/register',
    [   
        body('email', "Formato de Email incorrecto").trim().isEmail().normalizeEmail(),
        body("password", "Minimo debe tener 6 Caracteres").trim().isLength({ min: 6 }),
        body("password", "Formato de Password incorrecta").custom((value, {req}) => {
            if(value !== req.body.repassword){
                throw new Error('No coinciden las contraseñas');
            };
            return value
        })
    ], 
    validationResultGlobal,
    register);

router.post('/login',
    [
         
        body('email', "Formato de Email incorrecto").trim().isEmail().normalizeEmail(),
        body("password", "Minimo debe tener 6 Caracteres").trim().isLength({ min: 6 }),
    ],
    validationResultGlobal,
    login);

export default router;