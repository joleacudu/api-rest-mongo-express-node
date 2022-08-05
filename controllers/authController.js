import { User } from '../models/User.js'
import jwt from 'jsonwebtoken';

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

        const token = jwt.sign({ uid: user.id}, process.env.JWT_SECRET);
        return res.json({ token });
        
        // console.log("Se logueo el usuario")
        // return res.json({ ok: 'Login' });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Error de servidor' });
    }
};
