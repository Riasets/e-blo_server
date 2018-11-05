const refreshToken = require('./controllers/refreshToken');
const { header, validationResult } = require('express-validator/check');

module.exports = function (app, db) {
    app.get('/api/refresh',
        header('token').isString().withMessage('Empty token field'),
        (req, res) => {
        const errors = validationResult(req);
        console.log(errors.array());
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0] });
        }

        refreshToken(req.headers.token)
            .then((token)=>{
                console.log(token);
                res.send(token)
            })
            .catch((err)=>{
                console.log(err);
                res.status(400).send(err)
            })
    })
};