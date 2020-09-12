const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user)
    })
})

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({googleId:profile.id}).then((currentUser)=>{
            console.log(profile.photos[0].value)
            if(currentUser){
                console.log("User : ",currentUser)
                done(null,currentUser)
            }else{
                const user = new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    thumbnail: profile.photos[0].value
                })
                user.save()
                console.log(user)
                done(null,user)
            }
        })
        
    })
);