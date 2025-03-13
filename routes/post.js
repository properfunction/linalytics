const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const postController = require('../controllers/post')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.post('/createPost', upload.single("file"), postController.createPost) // The upload.single("file") specifies to expect a single file to be uploaded and "file" is the name of the input field in the HTML form
router.get('/:id', postController.getPost)
router.delete('/deletePost/:id', postController.deletePost)




module.exports = router;