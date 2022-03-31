import mongoose from 'mongoose';

var mongoDB =
    'mongodb+srv://vijay:1234@cluster0.mcuqt.mongodb.net/MCQ?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

const questionsSchema = new mongoose.Schema({
    testId: mongoose.ObjectId,
    question: String,
    options: Array,
    answer: String,
    selected: String,
    marks: Number,
});
const Question = mongoose.model('Question', questionsSchema);

const resultsSchema = new mongoose.Schema({
    testId: mongoose.ObjectId,
    userId: mongoose.ObjectId,
    score: Number,
    questions: Array,
});
const Result = mongoose.model('Result', resultsSchema);

const SubjectsSchema = new mongoose.Schema({
    name: String,
    imgsrc: String,
});
const Subject = mongoose.model('Subject', SubjectsSchema);

const TestsSchema = new mongoose.Schema({
    name: String,
    subjectId: mongoose.ObjectId,
});
const Test = mongoose.model('Test', TestsSchema);

const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    access: String,
});
const User = mongoose.model('User', usersSchema);

export { User, Subject, Test, Question, Result };
