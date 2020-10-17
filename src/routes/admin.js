const express = require('express');
const router = express.Router();
const { editValidator } = require('./../validator/adminValidator');
const authenticate = require('./../middleware/authenticate');
const User = require('../models/user');
router.post('/editprofile', authenticate, async (req, res) => {
    try {
        const { error } = await editValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ _id: req.user._id });
        await user.set(req.body);
        await user.save();

        res.status(200).send('ok');
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
