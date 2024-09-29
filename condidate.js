const mongoose = require("mongoose");

const condidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    votes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        voteAt: {
            type: Date,
            default: Date.now()
        }
    }],
    voteCount: {
        type: Number,
        default: 0
    }
});

const Condidate = mongoose.model('Condidate', condidateSchema);
module.exports = Condidate;