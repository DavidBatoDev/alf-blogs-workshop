require('dotenv').config()
const express = require('express')
const connectDb = require('./config/db')

const app = express()

connectDb()

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World' })
})

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080')
})