const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

//create a schema
const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'facebook', 'google'],
        required: true
    },
    local: {
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String
        }
    },
    google: {
        id:{
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook:{
        id:{
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    }
})

userSchema.pre('save', async function(next){
    try{
        if(this.method !== 'local'){
            next()
        }
        //generate a salt
        const salt = await bcrypt.genSalt(10)
        //generate a password hash
        const passwordHash = await bcrypt.hash(this.local.password, salt)
        //Re-assign hashed version over original, plain text password 
        this.local.password = passwordHash
        next()
    }catch(error){
        next(error)
    }
})

userSchema.methods.isValidPassword = async function(newPassword) {
    try{
        return await bcrypt.compare(newPassword, this.local.password)
    }catch(error){
        throw new Error(error)
    }
}

//create a model
const User = mongoose.model('user', userSchema)

//export the model
module.exports = User