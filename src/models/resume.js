const mongoose = require('mongoose');
const resumeSchmea = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    family: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 255,
        required: true,
    },
    bornDate: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    education: {
        type: String,
        default: 'Studying',
    },
    achievements: [
        {
            name: {
                type: String,
            },
            date: {
                type: String,
            },
        },
    ],
    skills: [
        {
            name: {
                type: String,
            },
            rate: {
                type: Number,
                default: 0,
            },
        },
    ],
    works: [
        {
            name: {
                type: String,
            },
            join: {
                type: String,
            },
            left: {
                type: String,
                default: 'no',
            },
        },
    ],
});
