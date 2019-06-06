const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/project')
var User = require('./model/users.js')
var movie = require('./model/movie.js')
const { check, validationResult } = require('express-validator/check')
app.use(bodyParser.json())
app.use(express.json())
app.use('/api/dashboard', (req, res, next) => {
    var token = req.headers.authorization.split("Bearer")[1].trim()
    var tokenverify = jwt.verify(token)
    if (!tokenverify) {
        res.json({
            "success": false, error: {
                code: 401,
                message: "cannot authenticate"
            }
        })
    }
    app.post('/api/movies'), async (req, res) => {
        var movies = new movie({
            name,
            cast,
            releasedate
        })
        await movies.save()
    }
})

app.post('/api/signup', [
    check('username').not().isEmpty().isLength({ min: 5 }).withMessage('Username must be of at least 5 characters'),
    check('email', 'Enter a valid email').isEmail(),
    check('password').not().isEmpty()
],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        } else {
            const hashpswd = await bcrypt.hash(req.body.password, 10)
            const result = await User.findOne({ email: req.body.email })
            if (result) {
                res.json({
                    "success": false,
                    errors: {
                        "error code": '400',
                        "message": 'validation error'
                    }
                })
            } else {
                const accesstoken = jwt.sign({ name: req.body.name, email: req.body.email }, 'secret', { expiresIn: '6h' })
                const refreshtoken = jwt.sign({ name: req.body.name, email: req.body.email }, 'secret', { expiresIn: '30d' })
                var user = new User({
                    name: req.body.username,
                    password: hashpswd,
                    email: req.body.email
                })
                await user.save()
                return res.json({
                    "success": true,
                    accesstoken: accesstoken,
                    refreshtoken: refreshtoken,
                    data: {
                        "name": req.body.username,
                        "email": req.body.email
                    }
                })
            }
        }
    })
app.post('/api/login', async (req, res) => {
    const result = await User.findOne({ email: req.body.email })
    if (result) {
        const match = await bcrypt.compare(req.body.password, result.password)
        if (match) {
            const accesstoken = jwt.sign({ email: result.email, name: result.name }, 'secret', { expiresIn: '60m' })
            const refreshtoken = jwt.sign({ email: result.email, name: result.name }, 'secret', { expiresIn: '30d' })
            return res.json({
                accesstoken: accesstoken,
                refreshtoken: refreshtoken,
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
