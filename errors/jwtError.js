// 客製化 JsonWebToken 錯誤訊息模組
function jwtError(err) {
  if (err.name === 'JsonWebTokenError') {
    return { code: 401, message: '缺少憑證或憑證錯誤' }
  } else if (err.name === 'TokenExpiredError') {
    return { code: 401, message: '憑證過期' }
  } else {
    return { code: 400, message: '不明錯誤 (JsonWebToken)' }
  }
}

module.exports = jwtError
