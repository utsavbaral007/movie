const mongoose = require('mongoose')
mongoose.connect = ('mongodb://localhost:27017/movie')
const movie = new mongoose.Schema({
    name: {
        type: String
    },
    director: {
        type: String
    },
    releasedate: {
        type: String
    }
    
})
module.exports = mongoose.model('movie', movie) 