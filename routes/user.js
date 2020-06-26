const router = require('express-promise-router')()
const userController = require('../controllers/user')
const { schemas, validateBody } = require('../utils/routeHelper')
const passport = require('passport')

router
  .route('/signin')
  .post(
    [
      validateBody(schemas.signinSchema),
      passport.authenticate('local', { session: false })
    ],
    userController.signin
  )
router
  .route('/signup')
  .post(validateBody(schemas.signinSchema), userController.signup)
router
  .route('/secret')
  .get(passport.authenticate('jwt', { session: false }), userController.secret)
router.route('/oauth/google').post(userController.googleAuth)
router
  .route('/oauth/facebook')
  .post(
    passport.authenticate('facebook-token', { session: false }),
    userController.facebookAuth
  )

module.exports = router
