const Router = require('express').Router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = Router();

const createToken = () => {
    return jwt.sign({}, 'secret', { expiresIn: '1h' });
};

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const pw = req.body.password;
    // Check if user login is valid
    // If yes, create token and return it to client
    db.getDb()
        .db()
        .collection('users')
        .findOne({ email })
        .then((result) => {
            return bcrypt.compare(pw, result.password);
        })
        .then((authed) => {
          if (!authed) {
            throw Error();
          }

            const token = createToken();

            return res.status(201).json({
                token: token,
                message: 'Authenication succeeded.',
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(401).json({
                message:
                    'Authentication failed, invalid username or password.',
            });
        });
    const token = createToken();
    // res.status(200).json({ token: token, user: { email: 'dummy@dummy.com' } });
});

router.post('/signup', (req, res, next) => {
    const email = req.body.email;
    const pw = req.body.password;
    // Hash password before storing it in database => Encryption at Rest
    bcrypt.hash(pw, 12).then((hashedPW) => {
        // Store hashedPW in database
        db.getDb()
            .db()
            .collection('users')
            .insertOne({ email, password: hashedPW })
            .then((result) => {
                const token = createToken();

                return res.status(201).json({
                    token: token,
                    user: { email: result.email },
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: 'Creating the user failed.',
                });
            });
    });

    // Add user to database
});

module.exports = router;
