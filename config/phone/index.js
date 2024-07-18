// 引用簡訊發送器模組
const twilio = require('./twilio')
const twsms = require('./twsms')

// 發送簡訊
function sendSMS(data, type, smsType) {
  // 依環境變數使用 TwSMS / Twilio 簡訊發送器
  switch (true) {
    case smsType === 'twsms':
      return twsms(data, type)
      break
    case smsType === 'twilio':
      return twilio('+886' + data.phone.slice(1), data.otp)
      break
  }
}

module.exports = sendSMS
