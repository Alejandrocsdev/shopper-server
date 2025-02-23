const { Router } = require('express')
const router = Router()

const { authController } = require('../controllers')

const { checkId } = require('../middlewares')

const { pwdSignInAuth, smsSignInAuth, fbSignUpCb, fbSignUpAuth } = require('../config/passport')

// 驗證參數 userId
router.param('userId', checkId)

// 更新憑證
router.get('/refresh', authController.refresh)

// 登入
router.post('/signIn/auto/:userId', authController.autoSignIn)
router.post('/signIn/pwd', pwdSignInAuth, authController.signIn)
router.post('/signIn/sms', smsSignInAuth, authController.signIn)
router.get('/signUp/facebook/callback', fbSignUpCb)
router.get('/signUp/facebook', fbSignUpAuth)

// 註冊
router.post('/signUp', authController.signUp)
router.post('/signUp/facebook', authController.fbSignUp)

// 登出
router.get('/signOut', authController.signOut)

module.exports = router
