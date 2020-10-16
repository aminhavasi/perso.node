const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Token = require('./auth');

const userSchema = new mongoose.Schema(
    {
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
    },
    { toJSON: { virtuals: true } }
);

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

    let token = jwt
        .sign(
            {
                _id: user._id.toHexString(),
            },
            process.env.JWT_CONFIG
        )
        .toString();
    const newToken = new Token({ user: user._id, token });
    newToken.save();

    return user.save().then(() => {
        return token;
    });
};
userSchema.virtual('user', {
    ref: 'Token',
    localField: '_id',
    foreignField: 'user',
});
userSchema.virtual('user', {
    ref: 'Recovery',
    localField: '_id',
    foreignField: 'user',
});

const User = mongoose.model('User', userSchema);

module.exports = User;
