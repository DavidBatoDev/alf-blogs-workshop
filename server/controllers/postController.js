
const Post = require('../models/postmodel')
const deleteFile = require('../utils/deleteFile')

// @desc    Create a Post
// @route   POST /posts  
// access   Public
const createPost = async (req, res) => {
    if (!req.body) {
        res.status(400)
        throw new Error('No request body`')
    }

    const { title, author, content, cover_photo } = req.body

    // Optionally check if req.file exists
    const path = req.file?.path ?? null;

    try {
        const post = new Post({
            title,
            author,
            content,
            cover_photo: path
        })

        const newPost = await post.save()

        if (newPost) {
            res.status(201).json(newPost)
        }
    } catch (err) {
        console.log(err)
        res.status(422).json(err)
    }
}

// @desc    Get all Posts
// @route   GET /posts  
// access   Public
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()

        res.json(posts)
    } catch (err) {
        console.log(err)
    }
}

// @desc    Get specified post
// @route   GET /posts/:id  
// access   Public
const showPost = async (req, res) => {
    try {
        const { id } = req.params

        const post = await Post.findById(id)

        if (!post) {
          // If post is null, throw an error
            throw new Error('Post not found')
        }

        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ error: 'Post not found' })
    }
}

// @desc    Update specified post
// @route   PUT/PATCH /posts/:id  
// access   Public
const updatePost = async (req, res) => {
    const { id } = req.params

    if (!req.body || !Object.keys(req.body).length) {
        res.status(400).json({ error: 'No request body' })
    }

    const { title, author, content } = req.body

    // Optionally check if req.file exists
    const path = req.file?.path ?? null;

    try {
        const originalPost = await Post.findById(id);

        if (!originalPost) {
            // Handle case where original post is not found
            return res.status(404).json({ error: 'Original post not found' });
        }

        // Only Delete the Previous Cover Photo if there's a newly UPLOADED file
        if (originalPost.cover_photo && path) {
            console.log(originalPost)
            deleteFile(originalPost.cover_photo)
        }

        // Update the fields of the original document
        originalPost.title = title;
        originalPost.author = author;
        originalPost.content = content;
        originalPost.cover_photo = path;

        // Save Post
        const updatedPost = await originalPost.save();

        res.status(200).json(updatedPost)
    } catch (error) {
        console.log(error)
        res.status(422).json(error)
    }
}

// @desc    Delete specified post
// @route   DELETE /posts/:id  
// access   Public
const deletePost = async (req, res) => {
    const { id } = req.params

    const post = await Post.findByIdAndDelete(id)

    if (!post) {
        return res.status(404).json({ message: 'post not found' })
    }

    res.status(201).json({ message: 'Successfully deleted post!' })
}

module.exports = {
    createPost,
    getAllPosts,
    showPost,
    updatePost,
    deletePost,
}
