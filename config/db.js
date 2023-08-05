const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongoose connected ${mongoose.connection.host}`.bgGreen.white);
    } catch (error) {
        console.log(`Mongo Server Issue ${error}`.bgRed.white);
    }
}

module.exports = connectDB;