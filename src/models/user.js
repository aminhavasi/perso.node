const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 255,
        required: true,
    },
    email: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 1024,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    access: {
        type: String,
        required: true,
    },
    tokens: [
        {
            _id: false,
            access: {
                type: String,
                required: true,
            },
            token: {
                type: String,
                required: true,
            },
            expireAt: { type: Date, expires: 3600, default: Date.now },
        },
    ],
});

userSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.statics.findByCredintials = function (email, password) {
    let User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) return Promise.reject('not');
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject('not');
                }
            });
        });
    });
};

userSchema.methods.genAuthToken = function () {
    let user = this;
    let access = 'user';
    let token = jwt
        .sign(
            {
                _id: user._id.toHexString(),
                access,
            },
            process.env.JWT_CONFIG
        )
        .toString();
    user.tokens.push({ token, access });
    return user.save().then(() => {
        return token;
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
