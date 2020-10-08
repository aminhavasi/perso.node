const express = require('express');
const router = express.Router();

const { registerValidator } = require('./../validator/authValidator');

router.post('/register', async (req, res) => {
    try {
        const { error } = await registerValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
