import mongoose from 'mongoose';

var mongoDB = 'mongodb://127.0.0.1/MCQ';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

const TestsSchema = new mongoose.Schema({
    subjectId: mongoose.ObjectId,
});
const Test = mongoose.model('Test', TestsSchema);

var newTest = new Test({
    subjectId: new mongoose.Types.ObjectId('624405904673b5ddf5ce3192'),
});
newTest.save(function (err, newUser) {
    console.log(newUser);
});
