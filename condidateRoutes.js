const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../jwt.js')
const Condidate = require('../models/condidate.js');
const User = require('../models/user.js');
const { use } = require('passport');

const checkAdminRole = async(userId) => {
    try {
        const user = await User.findById(userId);
        if (user.role === "admin")
            return true;
    } catch (err) {
        return false;
    }
}

router.post('/', jwtAuthMiddleware, async(req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) {
            return res.status(403).json({ massage: "user does not have admin role" });
        }
        const data = req.body
        const newCondidate = new Condidate(data);
        const response = await newCondidate.save();
        console.log('data saved');
        res.status(200).json({ response: response });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/:condidateID', jwtAuthMiddleware, async(req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) {
            return res.status(403).json({ massage: "user does not have admin role" });
        }
        const condidateID = req.params.condidateID;
        const updataCondidateDatd = req.body;
        const response = await Person.findByIdAndUpdate(condidateID, updataCondidateDatd, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            return res.status(404).json({ erorr: 'condidate not found' })
        }
        console.log('condidate data updated');
        res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Erorr' });
    }
})

router.delete('/:condidateID', jwtAuthMiddleware, async(req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) {
            return res.status(403).json({ massage: "user does not have admin role" });
        }
        const condidateID = req.params.condidateID;
        const response = await Condidate.findByIdAndDelete(condidateID);

        if (!response) {
            return res.status(404).json({ erorr: 'condidate not found' })
        }
        console.log('condidate deleted');
        res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Erorr' });
    }
})

//let's start vorting
router.post('/vote/:condidateID', jwtAuthMiddleware, async(req, res) => {
    condidateID = req.params.condidateID;
    userId = req.user.id;
    try {
        const candidate = await Condidate.findById(condidateID);
        if (!candidate) {
            return res.status(404).json({ massage: "Condidate not found" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ massage: "User not found" });
        }
        if (user.isVoted) {
            res.status(400).json({ massage: 'You have already voted' });
        }
        if (user.role == 'admin') {
            res.status(403).json({ massage: 'admin is not allowed' });
        }
        candidate.votes.push({ user: userId })
        candidate.voteCount++;
        await candidate.save();
        user.isVoted = true
        await user.save();
        res.status(200).json({ massage: 'vote recorded successfully' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ massage: 'Internal Server Error' });
    }
})
router.get('/vote/count', async(req, res) => {
    try {
        const candidate = await Condidate.find().sort({ voteCount: 'desc' });
        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        });
        return res.status(200).json(voteRecord);
    } catch (err) {
        console.log(err);
        res.status(500).json({ massage: 'Internal Server Error' });
    }
})
module.exports = router;