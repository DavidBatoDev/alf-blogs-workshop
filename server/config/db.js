// db here
const mongoose = require('mongoose');

const DATABASE_URI = process.env.DATABASE_URI 

const connectDb = async () => {
    try {
        await mongoose.connect(DATABASE_URI)
        console.log('MongoDB is connected')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDb;