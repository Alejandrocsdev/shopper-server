// 引用 Models
const { User } = require('../models')
// 引用異步錯誤處理中間件
const { asyncError } = require('../middlewares')
// 引用 成功回應 / 加密 / Cookie 模組
const { sucRes, encrypt, cookie } = require('../utils')
// 引用自定義驗證模組
const Validator = require('../Validator')
// 引用驗證模組
const Joi = require('joi')
// 客製化錯誤訊息模組
const CustomError = require('../errors/CustomError')
// Body驗證條件(base)
const schema = Joi.object({
  password: Joi.string().min(8).max(16).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).required()
})
// Body驗證條件(extra)
const signUpBody = { phone: Joi.string().pattern(/^09/).length(10).required() }
const fbBody = { 
  email: Joi.string().email(),
  avatar: Joi.string().uri({ scheme: ['https'] }).required(),
  facebookId: Joi.string().required()
 }

class AuthController extends Validator {
  constructor() {
    super(schema)
  }

  refresh = asyncError(async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) throw new CustomError(401, '查無刷新憑證')

    console.log(req.body)

    const refreshToken = cookies.jwt

    const user = await User.findOne({ where: { refreshToken } })

    const { id } = encrypt.verifyToken(refreshToken, 'RT')
    console.log('id: ', id)
    console.log('id typeof: ', typeof id)
    console.log('user.id: ', user.id)
    console.log('user.id typeof: ', typeof user.id)

    if (!user || id !== user.id) throw new CustomError(403, '存取憑證刷新失敗')

    const accessToken = encrypt.signAccessToken(id)

    sucRes(res, 200, '存取憑證刷新成功', accessToken)
  })

  autoSignIn = asyncError(async (req, res, next) => {
    const { userId } = req.params

    const user = await User.findByPk(userId)

    // 驗證用戶是否存在
    this.validateData([user])

    const accessToken = encrypt.signAccessToken(userId)
    const refreshToken = encrypt.signRefreshToken(userId)

    await User.update({ refreshToken }, { where: { id: userId } })

    cookie.store(res, refreshToken)

    sucRes(res, 200, '登入成功', accessToken)
  })

  signIn = asyncError(async (req, res, next) => {
    const { user } = req
    if (!user) throw new CustomError(401, '登入失敗')

    const accessToken = encrypt.signAccessToken(user.id)
    const refreshToken = encrypt.signRefreshToken(user.id)

    await User.update({ refreshToken }, { where: { id: user.id } })

    cookie.store(res, refreshToken)

    sucRes(res, 200, '登入成功', accessToken)
  })

  signUp = asyncError(async (req, res, next) => {
    // 驗證請求主體
    this.validateBody(req.body, signUpBody)
    const { phone, password } = req.body

    const hashedPassword = await encrypt.hash(password)

    // 生成唯一帳號
    const username = await encrypt.uniqueUsername(User)

    const user = await User.create({ username, password: hashedPassword, phone })

    const newUser = user.toJSON()
    delete newUser.password

    sucRes(res, 201, '新用戶註冊成功', newUser)
  })

  fbSignUp = asyncError(async (req, res, next) => {
    // 驗證請求主體
    this.validateBody(req.body, fbBody)
    const { facebookId, email, avatar, password } = req.body
    console.log('avatar: ', avatar)

    const hashedPassword = await encrypt.hash(password)

    // 生成唯一帳號
    const username = await encrypt.uniqueUsername(User)

    const user = await User.create({ username, password: hashedPassword, facebookId, email, avatar })

    const newUser = user.toJSON()
    delete newUser.password
    delete newUser.refreshToken

    sucRes(res, 201, '新用戶註冊成功', newUser)
  })

  signOut = asyncError(async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
      return sucRes(res, 200, '登出成功')
    }

    const refreshToken = cookies.jwt
    const user = await User.findOne({ where: { refreshToken } })

    cookie.clear(res)

    if (user) {
      await User.update({ refreshToken: null }, { where: { id: user.id } })
    }

    return sucRes(res, 200, '登出成功')
  })
}

module.exports = new AuthController()
