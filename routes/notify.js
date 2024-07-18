const { Router } = require('express')
const router = Router()

const { notifyController } = require('../controllers')

// 簡訊
router.post('/reset/password/email', notifyController.resetCompleteEmail)
router.post('/reset/password/phone', notifyController.resetCompletePhone)

module.exports = router
