const express = require('express');
const router = express.Router();
const { resumeValidator } = require('./../validator/resumeValidator');
const Resume = require('./../models/resume');
const authenticate = require('./../middleware/authenticate');

router.post('/create', authenticate, async (req, res) => {
    try {
        const { error } = await resumeValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const newResume = await new Resume(req.body);
        await newResume.save();
        res.status(201).send(newResume);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/delete', authenticate, async (req, res) => {
    try {
    } catch (err) {}
});

module.exports = router;
