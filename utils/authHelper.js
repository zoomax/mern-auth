const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const localStrategy = require('passport-local')
const { ExtractJwt } = require('passport-jwt')
const UserModel = require('../models/user')
const googleTokenStrategy = require('passport-google-plus-token')
const facebookTokenStrategy = require('passport-facebook-token')
passport.use(
  new jwtStrategy(
    {
      secretOrKey: process.env.TOKEN_SECRET, // the secret or key used to decode our token
      jwtFromRequest: ExtractJwt.fromHeader('authorization') // where to get the token
    },
    async (payload, done) => {
      try {
        // fetch userid from the token
        const user = UserModel.findOne({ _id: payload.sub })
        // handling not found user
        if (!user) {
          done(null, false)
        }
        // sending user data
        else {
          done(null, user)
        }
      } catch (error) {
        // handling errors
        return null, error
      }
    }
  )
)
// LOCAL_STRATEGY HANDLER
passport.use(
  new localStrategy(
    {
      usernameField: 'email'
    },
    async (email, password, done) => {
      try {
        console.log(password)
        const user = await UserModel.findOne({ 'local.email': email })
        const isMatch = await user.isValidPassword(password)

        // handle not found user
        if (!user) return done(null, false)

        //handle incorrcet password
        if (!isMatch) return done(null, false)

        // send user
        return done(null, user)
      } catch (error) {
        // handle erors
        done(error, false, error.message)
      }
    }
  )
)
// GOOGLE API TOKEN HANDLER
passport.use(
  new googleTokenStrategy(
    {
      clientID: process.env.GOOGLE_API_CLIENT_ID,
      clientSecret: process.env.GOOGLE_API_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ 'google.id': profile.id })
        if (!user) {
          let newUser = new UserModel({
            method: 'google',
            google: {
              id: profile.id,
              email: profile.emails.length > 0 ? profile.emails[0].value : ''
            }
          })
          await newUser.save()
          return done(null, newUser)
        }
        return done(null, user)
      } catch (error) {
        return done(error, false, error.message)
      }
    }
  )
)
passport.use(
  new facebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_API_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_API_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile)
        let user = await UserModel.findOne({ 'facebook.id': profile.id })
        if (!user) {
          let newUser = new UserModel({
            method: 'facebook',
            facebook: {
              id: profile.id,
              email: profile.emails.length > 0 ? profile.emails[0].value : ''
            }
          })
          await newUser.save()
          return done(null, newUser)
        }
        return done(null, user)
      } catch (error) {
        return done(error, false, error.message)
      }
    }
  )
)
