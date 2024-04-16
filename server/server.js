// imports
require('dotenv').config();
const express = require('express')
const connectDb = require('./config/db')
const postRoutes = require('./routers/postRoute')
const cors = require('cors')

// constants
const app = express()

// connect to db
connectDb()

// middleware
app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World' })
})

// routes for posts
app.use('/posts', postRoutes)

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080')
})