const mongoose = require('mongoose');
const db = () => {
    mongoose.connect(
        process.env.URI,
        {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        },
        (err) => {
            if (err) console.log(err);
        }
    );
};

module.exports = { db };
