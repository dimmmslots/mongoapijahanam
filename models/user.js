const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const {config} = require('dotenv');
config();


mongoose.connect(process.env.MONGO_URI);

const Schema = mongoose.Schema;

const User = new Schema({
    username: String,
    password: String,
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);