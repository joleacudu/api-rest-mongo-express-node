import jwt from 'jsonwebtoken';

// export const requireTokenLocalStorage = (req, res, next) => {
//     try {
//         // console.log(req.headers);
//         let token = req.headers?.authorization; // con el ? en caso de que no exista o no se envia nada manda un undefined

//         if(!token) throw new Error('No Bearer');
        
//         token = token.split(" ")[1]; // separo el string en un array con un separador que en este caso es el espacio, y sabemos que el indice 0 es el bearer y el indice 1 es el token

//         const { uid }= jwt.verify(token, process.env.JWT_SECRET);
//         console.log(uid) //payload es lo que se usa para firmar el token, en este caso el uid por ende se recibira este uid
//         req.uid = uid;

//         next(); //nos manda a la siguiente intruccion que seria infoUSer en router.get('/protected', requireToken, infoUSer)
    
//     } catch (error) {
//         console.log(error.message)

//         //Errores de los token
//         const TokenVerificationErrors = {
//             "invalid signature": "la firma del JWT no es valida",
//             "jwt expired": "JWT expirado",
//             "invalid token": "Token no valido",
//             "No Bearer": "Utiliza formato Bearer",
//             "jwt malformed": "JWT formato no valido",
//             "jwt must be provided": "El token debe ser proporcionado",
//         }

//         return res.status(401).send({error: TokenVerificationErrors[error.message] });
//     }
// }

export const requireTokenCookie =  (req, res, next) =>{
    try {
        let token = req.headers?.authorization;
        console.log(token)

        if(!token) throw new Error("No Bearer");

        token = token.split(" ")[1];
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid  = uid;
        next();

    } catch (error) {
        console.log(error)

        //Errores de los token
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