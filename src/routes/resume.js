const express = require('express');
const router = express.Router();
const {
    resumeValidator,
    resumeDelete,
    resumeEdit,
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
    try {
        const post = await Resume.findOne({}, {}, { sort: { _id: 1 } });
        if (post) {
            res.status(200).send(post);
        } else {
            throw new Error('resume not found');
        }
    } catch (err) {
        if (err.message === 'resume not found') {
            res.status(404).send(err.message);
        } else {
            res.status(400).send(err);
        }
    }
});

router.put('/edit', authenticate, async (req, res) => {
    try {
        const { error } = await resumeEdit(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const resume = await Resume.findOne({ _id: req.body._id });
        if (!resume) {
            res.status(404).send('resume not found');
        } else {
            await resume.set(req.body);
            await resume.save();
            res.status(200).send('ok');
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

module.exports = router;
