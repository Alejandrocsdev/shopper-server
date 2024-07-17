// 引用 Passport-Local 模組
const { Strategy } = require('passport-local')
// 引用 Models
const { User } = require('../../models')
// 引用加密模組
const { encrypt } = require('../../utils')
// 引用客製化錯誤訊息模組
const CustomError = require('../../errors/CustomError')

// 客製化設定
const customFields = { usernameField: 'loginKey', passwordField: 'password' }

// 驗證函式
const verifyCallback = async (loginKey, password, cb) => {
  try {
    // 根據 信箱 / 電話 / 帳號 查找用戶
    const users = await Promise.all([
      User.findOne({ where: { email: loginKey } }),
      User.findOne({ where: { phone: loginKey } }),
      User.findOne({ where: { username: loginKey } })
    ])

    // 找到存在用戶索引
    const userIndex = users.findIndex((user) => user !== null)
    if (userIndex === -1) throw new CustomError(404, '輸入資料錯誤')

    // 根據索引取得用戶
    const user = users[userIndex]

    // 比較密碼
    const match = await encrypt.hashCompare(password, user.password)
    if (!match) throw new CustomError(401, '輸入密碼錯誤')

    // 傳遞驗證成功的用戶資料
    cb(null, user)
  } catch (err) {
    // 傳遞錯誤
    cb(err)
  }
}

// 定義 Local 策略
const localStrategy = new Strategy(customFields, verifyCallback)

module.exports = localStrategy
