const express = require('express')
const {check} = require('express-validator')

const usersControllers = require('../controllers/users-controllers')

const router = express.Router()

router.get('/', usersControllers.getUsers)

router.post(
    '/signup',
    [
        check('name')
            .not()
            .isEmpty(),
        check('email')
            .normalizeEmail() // Converts to normal email format FaKe@FAKE.com => fake@fake.com
            .isEmail(),
        check('password')
            .isLength({min: 6})
    ],
    usersControllers.signup
)

router.post('/login', usersControllers.login)

module.exports = router