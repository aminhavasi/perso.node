const express = require('express');
const router = express.Router();
const {
    resumeValidator,
    resumeDelete,
} = require('./../validator/resumeValidator');
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
        const { error } = await resumeDelete(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const statusDelete = await Resume.findOneAndDelete({
            _id: req.body._id,
        });
        if (statusDelete) {
            res.status(200).send('success delete');
        } else {
            throw new Error('not found');
        }
        res.status(200).send('success delete');
    } catch (err) {
        if (err.message === 'not found') {
            res.status(404).send('_id is invalid');
        } else {
            res.status(400).send(err);
        }
    }
});

router.get('/get', async (req, res) => {
    await Resume.findOne({}, {}, { sort: { _id: 1 } }, function (err, post) {
        console.log(post);
    });
});

module.exports = router;
