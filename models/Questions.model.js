import mongoose from 'mongoose';

var mongoDB = 'mongodb://127.0.0.1/MCQ';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

const questionsSchema = new mongoose.Schema({
    testId: mongoose.ObjectId,
    question: String,
    options: Array,
    answer: String,
    marks: Number,
    selected: String,
});
const Question = mongoose.model('Questions', questionsSchema);

var newQuestion = new Question({
    testId: new mongoose.Types.ObjectId('62440608db8ff33b92cefb52'),
    question: 'What is the capital of China?',
    options: ['Beijing', 'Newyork', 'Chennai', 'Kolkata'],
    answer: 'Beijing',
    correct: 'Beijing',
});
newQuestion.save(function (err, newUser) {
    console.log(newUser);
});
