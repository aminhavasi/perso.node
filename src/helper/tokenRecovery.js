const jwt = require('jsonwebtoken');
const genAuthTokenRecovery = (user) => {
    const token = jwt.sign(
        {
            _id: user._id,
        },
        process.env.RECOVERYTOKEN
    );
    return token;
};
module.exports = genAuthTokenRecovery;
