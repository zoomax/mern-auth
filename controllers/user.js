const UserModel = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const googleAuthLibrary = require('google-auth-library')
const client = new googleAuthLibrary.OAuth2Client(
  process.env.GOOGLE_AIP_CLIENT_ID
)
const googleAuth = async (req, res, next) => {
  const { tokenId } = req.body
  const response = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_AIP_CLIENT_ID
  })
  const { email_verified, email, name, sub } = response.payload
  console.log(email)
  if (email_verified) {
    let user = await UserModel.findOne({ 'google.id': sub })
    if (user) {
      let token = createToken(user)
      console.log('already here')
      res.status(200).json({
        user,
        token
      })
    } else {
      console.log('newly created')

      let newUser = new UserModel({
        method: 'google',
        google: {
          id: sub,
          email
        }
      })
      user = await newUser.save()
      const token = createToken(user)
      res.status(200).json({
        user,
        token
      })
    }
  } else {
    res.status(403).json({
      errorMessage: 'email  not varified'
    })
  }
}

const createToken = user => {
  return jwt.sign(
    {
      iss: 'api-authintication',
      sub: user._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    },
    process.env.TOKEN_SECRET
  )
}
const signin = async (req, res, next) => {
  let user = req.user
  console.log(user)
  let token = createToken(user)
  return res.status(200).json({
    body: user,
    token,
    successMsg: 'you logged in successfully'
  })
}
const signup = async (req, res, next) => {
  const { email, password } = req.value.body
  let user = await UserModel.findOne({
    'local.email': email
  })
  if (user) {
    return res.status(403).json({
      failureMsg: 'email is already in use'
    })
  } else {
    let newUser = new UserModel({
      method: 'local',
      local: {
        email,
        password
      }
    })
    user = await newUser.save()
    const token = createToken(user)
    res.status(200).json({
      body: user,
      token,
      successMsg: "you've been registered"
    })
  }
}

const facebookAuth = async function (req, res, next) {
  const token = createToken(req.user)
  res.status(200).json({
    message: "you're authenticated",
    user: req.user,
    token
  })
}
const secret = async (req, res, next) => {
  console.log("we're here")
  return res.status(200).json({
    data: 'secret resourse'
  })
}
module.exports = {
  signin,
  signup,
  secret,
  googleAuth,
  facebookAuth
}
