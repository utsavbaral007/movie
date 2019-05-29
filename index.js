const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/project')
var User = require('./model/users.js')
const { check, validationResult } = require('express-validator/check')
app.use(bodyParser.json())
app.use(express.json())
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
            var hashpswd = await bcrypt.hash(req.body.password, 10)
            var result = await User.findOne({ email: req.body.email })
            if (result) {
                res.json({ 'email already exists': req.body.email })
            } else {
                var user = new User({
                    name: req.body.username,
                    password: hashpswd,
                    email: req.body.email
                })
                user.save()
                res.json({ 'result': user })
            }
        }
    })
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening to port ${port}`))
