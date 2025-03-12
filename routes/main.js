const express = require('express')
const router = express.Router();
const homeController = require('../controllers/home')
const postController = require('../controllers/post')
const { ensureAuth, ensureGuest } = require("../middleware/auth.js")

// Main Routes

router.get("/", homeController.getIndex)
router.get("/profile", ensureAuth, postController.getProfile)
router.get("/feed", ensureAuth, postController.getFeed)

module.exports = router;
