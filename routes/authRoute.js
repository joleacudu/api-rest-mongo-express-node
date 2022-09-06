import { Router } from 'express';
import { infoUser, login, register, refreshToken, logOut} from '../controllers/authController.js';
import { body } from 'express-validator';
import { validationResultGlobal } from '../middlewares/validationResultGlobal.js';
// import { requireTokenLocalStorage } from '../middlewares/requireToken.js';
import { requireTokenCookie} from '../middlewares/requireToken.js';

const router = Router();

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

// router.get('/protected', requireTokenLocalStorage, infoUser)
router.get('/protected', requireTokenCookie, infoUser)
router.get("/refresh", refreshToken)
router.get("/logout", logOut)

export default router;