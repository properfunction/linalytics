const mongoose = require('mongoose')

const TestSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Test", TestSchema);