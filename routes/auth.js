const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth')
const { ensureAuth, ensureGuset } = require("../middleware/auth")

router.get('/signup', authController.getSignup) // This is coming from the signup button in the index.ejx which is set to /auth/signup
router.get('/login', authController.getLogin)
router.post('/signup', authController.postSignup)
router.post('/login', authController.postLogin)
router.get('/logout', authController.logout)
router.post('/login-guest', authController.postLoginGuest)

module.exports = router;