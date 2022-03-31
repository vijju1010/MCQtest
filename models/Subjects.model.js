import mongoose from 'mongoose';

var mongoDB = 'mongodb://127.0.0.1/MCQ';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

const SubjectsSchema = new mongoose.Schema({
    name: String,
    imgsrc: String,
});
const Subject = mongoose.model('Subject', SubjectsSchema);

var newSubject = new Subject({
    name: 'Math',
    imgsrc: String,
});
newSubject.save(function (err, newSubject) {
    console.log(newSubject);
});
