// imports
const express = require('express')
const { 
    getAllPosts,
    createPost,
    showPost,
    updatePost,
    deletePost
} = require('../controllers/postController')
const upload = require('../middleware/uploadMiddleware')

// constants
const router = express.Router()

// routes
router.get('/', getAllPosts)
router.post('/', upload.single('cover_photo'), createPost)
router.put('/:id', upload.single('cover_photo'), updatePost)
router.get('/:id', showPost)
router.delete('/:id', deletePost)

module.exports = router
