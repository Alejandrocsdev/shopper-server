// TwSMS 帳號資料
const BASE_API = process.env.TWSMS_API
const username = process.env.TWSMS_USERNAME
const password = process.env.TWSMS_PASSWORD

// 引用 axios
const axios = require('axios')
// 引用客製化錯誤訊息模組
const CustomError = require('../../../errors/CustomError')

// TwSMS 簡訊發送器
async function twsms(data, type) {
  // 簡訊內容
  const resetOtpMsg = `【瞎皮爾購物】輸入 ${data.otp} 以建立您的帳號，15 分鐘內有效。請不要將驗證碼分享給任何人，包括瞎皮爾員工。`
  const resetCompleteMsg = `【瞎皮爾購物】您的密碼最近在 ${data.date} 完成了變更。如果您並未要求更改密碼，請立刻聯絡我們的瞎皮爾客服團隊。`
  const message = type === 'resetOtp' ? resetOtpMsg : resetCompleteMsg
  // API路徑
  const API = `${BASE_API}?username=${username}&password=${password}&mobile=${data.phone}&message=${message}`

  try {
    if (!username) throw new CustomError(500, '缺少: TwSMS 帳號.')
    if (!password) throw new CustomError(500, '缺少: TwSMS 密碼.')

    // 發送簡訊
    await axios.get(API)
  } catch (err) {
    throw new CustomError(500, 'OTP發送失敗 (TwSMS)')
  }
}

module.exports = twsms
