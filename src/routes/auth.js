const express = require('express');
const router = express.Router();
const persianDate = require('persian-date');
const {
    registerValidator,
    loginValidator,
} = require('./../validator/authValidator');
const User = require('../models/user');
persianDate.toLocale('en');
const date = new persianDate().format('YYYY/M/DD');
router.post('/register', async (req, res) => {
    try {
        const { error } = await registerValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const user = await User.findOne({ email: req.body.email });
        const docs = await User.count();

        if (user) return res.status(400).send('This user Already exict!');
        req.body.date = date;
        docs === 0
            ? (req.body.access = 'creator')
            : (req.body.access = 'admin');
        const newUser = await new User(req.body);
        await newUser.save();
        await res.status(201).send('user created');
    } catch (err) {
        console.log(err);

        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { error } = await loginValidator(req.body);
        if (error) return res.status(400).send(error);
        const user = await User.findByCredintials(
            req.body.email,
            req.body.password
        );
        const token = await user.genAuthToken();
        res.status(200).header('x-auth', token).send();
    } catch (err) {
        if (err === 'not')
            return res.status(404).send('Your email or password is incorrect');
        console.log(err);
        res.status(400).send('something went wrong');
    }
});

module.exports = router;
