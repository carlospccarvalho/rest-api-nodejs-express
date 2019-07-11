const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const FacebookTokenStrategy = require('passport-facebook-token')
const {ExtractJwt} = require('passport-jwt')
const config = require('./configuration')
const User = require('./models/user')

//JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWT_SECRET
}, async (payload, done) =>{
    try{
        //find the user specified i n token
        const user = await User.findById(payload.sub)

        //if user doesn't exists, handle it
        if(!user){
            return done(null, false)
        }

        //otherwise, return the user
        done(null, user)
 
    }catch(error){
        done(error, false)
    }
}))

//FACEBOOK STRATEGY
passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try{
        console.log('profile', profile)
        console.log('accessToken', accessToken)
        console.log('refreshToken', refreshToken)

        const existingUser = await User.findOne({"facebook.id": profile.id})
        if(existingUser){
            return done(null, existingUser)
        }
        const newUser = new User({
            method: 'facebook',
            facebook:{
                id: profile.id,
                email: profile.emails[0].value
            }
        })

        await newUser.save()
        done(null, newUser)
        
    }catch(error){
        done(error, false, error.message)
    }
}))

//LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, passport, done) => {

    try{
        //find the user given the email
        const user = await User.findOne({"local.email": email})

        console.log('user', user)

        //if not, handle it
        if(!user){
            return done(null, false)
        }

        //check if the password is correct 
        const isMatch = await user.isValidPassword(passport)

        //if not, handle it
        if(!isMatch){
            return done(null, false)
        }
        //otherwise, return the user
        done(null, user)
    
    }catch(error){

        done(error, false)

    }

    
}))