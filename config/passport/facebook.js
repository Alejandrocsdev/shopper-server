// 引用 Passport-Local 模組
const { Strategy } = require('passport-facebook')
// 引用 Models
const { User } = require('../../models')
// 引用 後端網域 模組
const { backUrl } = require('../../utils')
// 引用客製化錯誤訊息模組
const CustomError = require('../../errors/CustomError')

// 資料設定
const config = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${backUrl}/auth/signUp/facebook/callback`,
  profileFields: ['email', 'photos']
}

// 驗證函式
const verifyCallback = async (accessToken, refreshToken, profile, cb) => {
  try {
    const facebookId = profile.id
    const email = profile.emails[0].value
    const avatar = profile.photos[0].value
    console.log({ facebookId, email, avatar })

    // 根據 臉書ID / 信箱 查找用戶
    const users = await Promise.all([
      User.findOne({ where: { facebookId } }),
      User.findOne({ where: { email } })
    ])

    console.log(users)

    // 找到存在用戶索引
    const userIndex = users.findIndex((user) => user !== null)

    const user = userIndex === -1 ? { facebookId, email, avatar } : users[userIndex]

    // 傳遞驗證成功的用戶資料
    cb(null, user)
  } catch (err) {
    // 傳遞錯誤
    cb(err)
  }
}

// 定義 Facebook 策略
const facebookStrategy = new Strategy(config, verifyCallback)

module.exports = facebookStrategy
