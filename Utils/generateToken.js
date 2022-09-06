import jwt from 'jsonwebtoken';

export const generateToken = (uid) => {
    
    const expiresIn = 60 * 15; // con esto refrescamos el token cada 15 min, osea se cambia el token
    
    try {
        const token = jwt.sign({uid}, process.env.JWT_SECRET, {expiresIn}); // {expiresIn} es igual a tener {expiresIn: expireIn} porque la variable tiene el mismo nombre de la propiedad
        return {token, expiresIn};
    } catch (error) {
        console.log(error)
    }
};

export const generateRefreshToken = (uid, res) => {
    const expiresIn = 60 * 60 * 24 * 30
    try {
        const refreshToken = jwt.sign({uid}, process.env.JWT_REFRESH, {expiresIn});
        
        //lo guardo en una coookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: !(process.env.MODO === "developer"),
            expires: new Date(Date.now() + expiresIn * 1000), //se multiplica por mil por estar en milisegundos
        });
    } catch (error) {
        console.log(error)
    }
};