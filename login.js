const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
mongoose.connect('mongodb://localhost:27017/project')
const User = require('./model/users.js')
app.use(bodyParser.json())
app.use(express.json())
app.post('/api/login', async (req, res) => {
    const result = await User.findOne({ email: req.body.email })
    if (result) {
        const match = await bcrypt.compare(req.body.password, result.password)
        if (match) {
            const accesstoken = jwt.sign({ email: result.email, name: result.name }, 'secret', { expiresIn: '60m' })
            const refreshtoken = jwt.sign({ email: result.email, name: result.name }, 'secret', { expiresIn: '30d' })
            return res.json({
                refreshtoken,
                accesstoken,
                message: 'Sucessfully Logged in'
            })
        }
        else {
            return res.status(400).send('Invalid email or password')

        }
    }
    else {
        return res.status(400).send('Invalid email or password')
    }
})
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening to port ${port}`))