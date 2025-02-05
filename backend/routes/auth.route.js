const express = require('express')
const { signup, login, logout } = require('../controller/auth.controller')
const router = express.Router()


router.route('/login')
    .post(login)

router.route('/signup')
    .post(signup)

router.route('/logout')
    .post(logout)


module.exports = router