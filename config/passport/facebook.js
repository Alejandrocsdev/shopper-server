// 引用 Passport-Local 模組
const { Strategy } = require('passport-facebook')
// 引用 Models
const { User } = require('../../models')
// 引用加密模組
const { encrypt } = require('../../utils')
// 引用客製化錯誤訊息模組
const CustomError = require('../../errors/CustomError')

const backUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.FRONT_PROD_BASE_URL
    : process.env.FRONT_DEV_BASE_URL

// 資料設定
const config = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${backUrl}/auth/signIn/facebook/callback`,
  profileFields: ['email', 'photos']
}

// 驗證函式
const verifyCallback = async (accessToken, refreshToken, profile, cb) => {
  try {
    const facebookId = profile.id
    const email = profile.emails[0].value
    const avatar = profile.photos[0].value

    // 傳遞驗證成功的用戶資料
    cb(null, { facebookId, email, avatar })
  } catch (err) {
    // 傳遞錯誤
    cb(err)
  }
}

// 定義 Facebook 策略
const facebookStrategy = new Strategy(config, verifyCallback)

module.exports = facebookStrategy
