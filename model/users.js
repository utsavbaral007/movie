const mongoose = require('mongoose')
mongoose.connect = ('mongodb://localhost:27017/project')
const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    }
}
)
module.exports = mongoose.model('user', Schema)