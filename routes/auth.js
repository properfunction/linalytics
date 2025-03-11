const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth')

router.get('/signup', authController.getSignup) // This is coming from the signup button in the index.ejx which is set to /auth/signup
router.get('/login', authController.getLogin)
router.post('/signup', authController.postSignup)

module.exports = router;