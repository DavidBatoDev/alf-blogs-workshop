const Post = require('../models/postModel')
const deleteFile = require('../utils/deleteFile')

// @desc Create a Post
// @route POST /posts
// @access Public
const createPost = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({message: "Contents must not be empty" })
    }
    const { title, author, content } = req.body

    const path = req.file?.path ?? null
    try {
        const post = new Post({
            title,
            author,
            content,
            cover_photo: path
        })
        const newPost = await post.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

// @desc Update a Post
// @route PUT /posts/:id
// @access Public
const updatePost = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: 'Content can not be empty!' })
    }

    const { id } = req.params
    const { title, author, content } = req.body

    const path = req.file?.path ?? null

    try {
        const originalPost = await Post.findById(id)

        if (!originalPost) {
            return res.status(404).json({ message: `Original Post not found`, success: false })
        }

        if (originalPost.cover_photo && path) {
            deleteFile(originalPost.cover_photo)
        }

        originalPost.title = title
        originalPost.author = author
        originalPost.content = content
        originalPost.cover_photo = path

        const updatedPost = await originalPost.save()

        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(500).json({ message: error.message, success: false})
    }
}

// @desc Get all the posts
// @route GET /posts
// @access Public
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc Get the posts
// @route GET /posts
// @access Public
const showPost = async (req, res) => {
    try {
        const {id} = req.params

        const post = await Post.findById(id)

        if (!post) {
            res.status(404).json({error: "Post not found"})
        }

        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({error: "Post not found"})
    }
}


// @desc Delete the post
// @route DELETE /posts
// @access Public
const deletePost = async (req, res) => {
    try {
        const { id } = req.params
    
        const post = await Post.findByIdAndDelete(id)
    
        if (!post) {
            return res.status(404).json({ message: 'post not found' })
        }

        if (post.cover_photo) {
            deleteFile(post.cover_photo)
        }
    
        res.status(201).json({ message: 'Successfully deleted post!' })

    } catch (error) {
        res.status(400).json({message: 'Post not found'})
    }
}

module.exports = {
    getAllPosts,
    createPost,
    updatePost,
    showPost,
    deletePost
}