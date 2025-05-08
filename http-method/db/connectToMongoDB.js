const mongoose = require('mongoose')

const connectToMongoDB = async() => {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Mongodb connected successfully')
}

module.exports = connectToMongoDB