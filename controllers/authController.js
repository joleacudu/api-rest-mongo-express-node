import { User } from '../models/User.js'
import jwt from 'jsonwebtoken';
import { generateRefreshToken, generateToken } from '../Utils/generateToken.js';

export const register = async(req, res) => {
    console.log(req.body)
    // res.json({ ok: 'Register' });
    const { email, password } = req.body; //hacemos la destructuracion del body
    try {
        // alternativa de buscar por email
        let user = await User.findOne({ email });
        if(user) throw { code: 11000 }; //si se valida el if el throw pasa al catch
        // if(user) return res.status(400).json({ error: 'Ya existe el usuario' }); //es lo mismo que la linea anterior,solo que con la anterior gestiono los errores y me envia al catch para ejecutar el error

        user = new User({email, password});

        await user.save();
        return res.json({ ok: true });
        
    } catch (error) {
        console.log(error);
        // añternativa por defecto de mongoose
        if(error.code === 11000){
            return res.status(400).json({ error: 'Ya existe el usuario' });
        }
        return res.status(500).json({ error: 'Error de servidor' });
    }
};

export const login = async(req, res) => {
    console.log(req.body)
    
    try {
        const { email, password } = req.body; //hacemos la destructuracion del body
        
        let user = await User.findOne({ email }); //busco el email para saber si esta registrado
        if(!user) return res.status(400).json({ error: 'Credenciales Incorrectas' });
        
        const respuestaPass = await user.comparePassword(password); //lo envio al User.js para que con el metodo de comparar contraseñas me las verifique y pueda loguearse el usuario
        if(!respuestaPass) return res.status(400).json({ error: 'Credenciales Incorrectas' });

        // const token = jwt.sign({ uid: user.id}, process.env.JWT_SECRET);
        const {token, expiresIn} = generateToken(user.id); //le envio el id del usuario a la funcion generateToken
        generateRefreshToken(user.id, res);

        return res.json({ token, expiresIn });
        
        // console.log("Se logueo el usuario")
        // return res.json({ ok: 'Login' });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Error de servidor' });
    }
};

export const infoUser = async(req, res) => {
    try {
        const user = await User.findById(req.uid).lean();
        return res.json({ user: user.email, uid: user.id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error de servidor' });
    }
}

export const refreshToken = (req, res) => {
    
    try {
        const refreshTokenCookie = req.cookies.refreshToken;

        if(!refreshTokenCookie) throw new Error("No existe el token");

        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
        const { token, expiresIn } = generateToken(uid);
        return res.json({ token, expiresIn });

    } catch (error) {
        console.log(error);

        const TokenVerificationErrors = {
            "invalid signature": "la firma del JWT no es valida",
            "jwt expired": "JWT expirado",
            "invalid token": "Token no valido",
            "No Bearer": "Utiliza formato Bearer",
            "jwt malformed": "JWT formato no valido",
            "jwt must be provided": "El token debe ser proporcionado",
        }

        return res.status(401).send({error: TokenVerificationErrors[error.message] });
    }
}

export const logOut = (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ ok: true });
}