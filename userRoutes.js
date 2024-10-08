const express = require('express');
const router = express.Router();
const User = require('./../models/user.js');
// const passport = require('../auth.js');
const app = express();
// app.use(passport.initialize());

const { jwtAuthMiddleware, generateToken } = require('../jwt.js')

router.post('/signup', async(req, res) => {
        try {
            const data = req.body
            const newUser = new User(data);
            const response = await newUser.save();
            console.log('data saved');

            const payload = {
                id: response.id
            }
            console.log(JSON.stringify(payload));
            const token = generateToken(payload);
            console.log("token is: ", token);
            res.status(200).json({ response: response, token: token });

        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    //login Router
router.post('/login', async(req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;
        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const payload = {
            id: user.id
        }
        const token = generateToken(payload);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erorr: 'Internal server Error' });
    }
})

router.get('/profile', jwtAuthMiddleware, async(req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erorr: 'Internal server Error' });
    }
})

router.put('/profile/password', jwtAuthMiddleware, async(req, res) => {
    try {
        const userId = req.user;
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);

        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ massage: 'Password updated' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Erorr' });
    }
})


module.exports = router;