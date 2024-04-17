const mongoose = require('mongoose');
const { mongodbURL } = require('../config');

const connectDatabase = async (options = {}) => {
    try {
        await mongoose.connect(mongodbURL, options)
        console.log('Connected to MONGODB')
        mongoose.connection.on('error', err => console.error('DB Connection error: ', err))

    } catch (e) {
        console.error('Could not connect to DB: ', e.toString())
    }
}
mongoose.set('strictQuery', false)
module.exports = connectDatabase