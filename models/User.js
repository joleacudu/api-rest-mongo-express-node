import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: { unique: true },
    },
    password: {
        type: String,
        required: true, 
    },
});

userSchema.pre("save", async function(next){
    
    const user = this;

    if(!user.isModified('password')) return next(); //Esto se hace para que no modifique nuevamente la pass, solo se hace una vez

    try {
        const salt = await bcryptjs.genSalt(10);
        const hasPass = await bcryptjs.hash(user.password, salt);
        user.password = hasPass;
        next(); 
    } catch (error) {
        console.log(error);
        throw new Error('Fallo el HASH de la Password')
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){ //documentacion de mongoose
    return await bcryptjs.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
