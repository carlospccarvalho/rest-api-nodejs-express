const JWT = require('jsonwebtoken')
const User = require('../models/user')
const {JWT_SECRET} = require('../configuration')

signToken = user => {
    return JWT.sign({
        iss: 'TemplateNodeJsExpress',
        sub: user._id,
        iat: new Date().getTime(), //current time
        exp: new Date().setDate(new Date().getDate() + 1) //current time + 1 day
    }, JWT_SECRET)
}

module.exports = {

    signUp: async (req, res, next) =>{

        const email = req.value.body.email
        const password = req.value.body.password

        //check if there is a user with the same email
        const foundUser =  await User.findOne({"local.email": email})
        if(foundUser){
            return res.status(403).json({error: 'email is already in use'})
        }

        //create a new user
        const newUser = new User({
            method: 'local',
            local: {
                email: email,
                password: password
            }
        })
        await newUser.save()

        //generate de token
        const token = signToken(newUser)

        //response with token
        res.status(200).json({token: token})

    },

    signIn: async (req, res, next) =>{
        const token = signToken(req.user)
        res.status(200).json({token})
    },

    facebookOAuth: async(req, res, next) =>{
        const token = signToken(req.user)
        res.status(200).json({token})
    },

    secret: async (req, res, next) =>{
       console.log('I managed to get here!')
       res.json({secret: 'resource'})
    }

}
