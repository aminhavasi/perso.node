const express = require('express');
const router = express.Router();
const persianDate = require('persian-date');
const {
    registerValidator,
    loginValidator,
    recoveryValidator,
} = require('./../validator/authValidator');
const User = require('../models/user');
const Token = require('./../models/auth');
const Recovery = require('../models/recovery');
const sendRecoveryEmail = require('../helper/email');
const genAuthTokenRecovery = require('../helper/tokenRecovery');
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
        res.status(400).send('something went wrong');
    }
});

router.delete('/logout', async (req, res) => {
    try {
        let token = req.body.token;
        if (!token) return res.status(404).send('Token not found!');
        const tt = await Token.findOneAndDelete({ token });

        if (tt) return res.status(200).send('logout success!');
        res.status(404).send('token not found');
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/recovery', async (req, res) => {
    try {
        const { error } = await recoveryValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const user = await User.findOne({ email: req.body.email });

        if (!user) return res.status(404).send('email not found');
        const newToken = await genAuthTokenRecovery(user);
        const token = new Recovery({
            user: user._id,
            token: newToken,
        });
        await token.save();
        await sendRecoveryEmail(user, newToken);
        res.status(200).send('ok');
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.post('/reset');

router.post('/editprofile');

module.exports = router;
