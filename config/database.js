const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_STRING);
        console.log('MongoDB connected')
    } catch (error) {
        console.error(error);
        process.exit(1); // Exit process if connection fails
    }
}

module.exports = connectDB;