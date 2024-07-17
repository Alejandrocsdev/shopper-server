// 引用 Passport 模組
const passport = require('passport')

// 引用 Models
const { User } = require('../../models')
// 引用 加密 / Cookie 模組
const { encrypt, cookie, errRes } = require('../../utils')
// 引用客製化錯誤訊息模組
const CustomError = require('../../errors/CustomError')

// 策略
const localStrategy = require('./local')
const smsStrategy = require('./sms')
const jwtStrategy = require('./jwt')

// 使用策略
passport.use('local', localStrategy)
passport.use('sms', smsStrategy)
passport.use('jwt', jwtStrategy)

// Passport 初始化
const passportInit = passport.initialize()

// 密碼登入驗證 / 簡訊登入驗證
const pwdSignInAuth = passport.authenticate('local', { session: false })
const smsSignInAuth = passport.authenticate('sms', { session: false })

// 憑證驗證
const jwtAuth = passport.authenticate('jwt', { session: false })

module.exports = { passportInit, pwdSignInAuth, smsSignInAuth, jwtAuth }
