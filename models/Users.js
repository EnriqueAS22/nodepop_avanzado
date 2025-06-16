import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String
}, {
    collection: 'users'
})

/**
 * HASH PASSWORD
 */
userSchema.statics.hashPassword = (clearPasword) => {
    return bcrypt.hash(clearPasword, 7)
}

userSchema.methods.comparePassword = function (clearPasword) {
    return bcrypt.compare(clearPasword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User