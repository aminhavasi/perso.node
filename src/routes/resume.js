const express = require('express');
const router = express.Router();
const { resumeValidator } = require('./../validator/resumeValidator');

router.post('/create', async (req, res) => {
    try {
        const { error } = await resumeValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        res.send(req.body);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
