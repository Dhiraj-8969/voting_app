const { request, default: mongoose } = require("mongoose");

const mongoURL = 'mongodb://localhost:27017/voting';
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('connected', () => {
    console.log('connected to mongodb server');
});

db.on('error', (err) => {
    console.log('mongoDB connection error', err);
});

db.on('disconnected', () => {
    console.log('mongodb server disconnected');
});

module.export = db;