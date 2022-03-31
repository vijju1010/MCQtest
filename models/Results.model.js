import mongoose from 'mongoose';

var mongoDB = 'mongodb://127.0.0.1/MCQ';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

const resultsSchema = new mongoose.Schema({
    testId: mongoose.ObjectId,
    userId: mongoose.ObjectId,
    score: Number,
    questions: Array,
});
const Result = mongoose.model('Result', resultsSchema);

var newResult = new Result({
    testId: new mongoose.Types.ObjectId('62440608db8ff33b92cefb52'),
    userId: new mongoose.Types.ObjectId('6243fcc8e4b6b5a4e7edaa9d'),
    score: 100,
    questions: [
        {
            question: 'What is the capital of India?',
            options: ['Delhi', 'Mumbai', 'Chennai', 'Kolkata'],
            answer: 'Delhi',
        },
        {
            question: 'What is the capital of USA?',
            options: ['Washington', 'New York', 'Los Angeles', 'Chicago'],
            answer: 'Washington',
        },
    ],
});
newResult.save(function (err, newResult) {
    console.log(newResult);
});
