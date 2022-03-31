import mongoose from 'mongoose';

var mongoDB = 'mongodb://127.0.0.1/MCQ';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});
const User = mongoose.model('User', usersSchema);

// var newUser = new User({
//     name: 'user1',
//     email: 'user1@grep.com',
//     password: 'user1',
// });
// var newUser1 = new User({
//     name: 'admin',
//     email: 'admin@grep.com',
//     password: 'admin',
// });

// newUser.save(function (err, newUser) {
//     console.log(newUser);
// });
