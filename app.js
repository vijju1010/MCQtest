import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import axios from 'axios';
import multer from 'multer';
import { User, Subject, Test, Question, Result } from './models/models.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use('/public', express.static('public'));

var st = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, '' + file.originalname.replace(' ', ''));
    },
});

const blob = multer({ storage: st });

// var mongoDB = 'mongodb://127.0.0.1/MCQ';
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.set('views', './views');
app.use('/uploads', express.static('uploads'));

app.get('/', function (req, res) {
    res.redirect('/login');
});
app.get('/logout', (req, res) => {
    res.clearCookie('loggedUser');
    res.clearCookie('password');
    res.redirect('/login');
});
app.get('/register', (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        res.redirect('/home');
    } else {
        res.render('register', { message: '' });
    }
});
app.get('/login', (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        res.redirect('/home');
    } else {
        res.render('login', { message: '' });
    }
});
app.get('/profile', (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        User.findOne({ name: req.cookies.loggedUser }, (err, user) => {
            if (err) {
                res.redirect('/login');
            } else {
                console.log(user);
                res.render('profile', { user: user });
            }
        });
    } else {
        res.redirect('/login');
    }
});

app.post('/requestAccess', (req, res) => {
    console.log(req.body);
    User.findById(req.body.id, (err, user) => {
        console.log(user, 'user');
        if (err) {
            res.send('Error');
        } else {
            User.findByIdAndUpdate(
                user._id,
                { access: 'teacher' },
                (err, user) => {
                    if (err) {
                        res.send('Error');
                    } else {
                        res.send({ status: 'success' });
                    }
                }
            );
        }
    });
});

app.get('/addsubject', (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        User.findOne({ name: req.cookies.loggedUser }, (err, user) => {
            if (user.access === 'teacher' || user.access === 'admin') {
                res.render('addsubject', { user: user });
            } else {
                res.send('You are not authorized to access this page');
            }
        });
    }
});

app.get('/updatetests', (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        Subject.find({}, (err, subjects) => {
            if (err) {
                console.log(err);
            } else {
                User.findOne({ name: req.cookies.loggedUser }, (err, user) => {
                    if (user.access === 'teacher' || user.access === 'admin') {
                        res.render('updatetests', {
                            user: user,
                            subjects: subjects,
                            tests: [],
                        });
                    } else {
                        res.send('You are not authorized to access this page');
                    }
                });
            }
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/updatetest/:subjectID', (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        Test.find({ subjectId: req.params.subjectID }, (err, tests) => {
            // find all tests of a subject
            console.log(tests, 'tests');
            if (tests.length === 0) {
                res.render('updatetests', {
                    user: { name: req.cookies.loggedUser },
                    subjects: [],
                    tests: tests,
                    message: 'No tests available',
                });
            } else {
                User.findOne({ name: req.cookies.loggedUser }, (err, user) => {
                    if (user.access === 'teacher' || user.access === 'admin') {
                        res.render('updatetests', {
                            user: user,
                            subjects: [],
                            tests: tests,
                        });
                    } else {
                        res.send('You are not authorized to view this page');
                    }
                });
            }
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/updatetestsubject/:testID', (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        Question.find({ testId: req.params.testID }, (err, data) => {
            // find all tests of a subject
            // console.log(data, 'questions');
            Test.findById(req.params.testID, (err, test) => {
                // find test by id
                if (err) {
                    console.log(err);
                } else {
                    console.log(test, 'test');
                    User.findOne(
                        { name: req.cookies.loggedUser },
                        (err, user) => {
                            if (
                                user.access === 'teacher' ||
                                user.access === 'admin'
                            ) {
                                res.render('updatetestform', {
                                    questions: data,
                                    user: user,
                                    subject: { id: test.subjectId },
                                    test: test,
                                });
                            } else {
                                res.send(
                                    'You are not authorized to view this page'
                                );
                            }
                        }
                    );
                }
            });
        });
    } else {
        res.redirect('/login');
    }
});
app.get('/responses', (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        Subject.find({}, (err, subjects) => {
            if (err) {
                console.log(err);
            } else {
                res.render('responses', {
                    user: { name: req.cookies.loggedUser },
                    subs: subjects,
                    tests: [],
                    results: [],
                });
            }
        });
    } else {
        res.redirect('/login');
    }
});
app.get('/responses/tests/:subjectID', (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        Test.find({ subjectId: req.params.subjectID }, (err, tests) => {
            // find all tests of a subject
            console.log(tests, 'tests');
            if (tests.length === 0) {
                res.render('responses', {
                    user: { name: req.cookies.loggedUser },
                    subs: [],
                    tests: tests,
                    message: 'No tests available',
                    results: [],
                });
            } else {
                res.render('responses', {
                    user: { name: req.cookies.loggedUser },
                    subs: [],
                    tests: tests,
                    results: [],
                });
            }
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/responses/test/:testID', (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        Result.find({ testId: req.params.testID }, (err, results) => {
            // find all tests of a subject
            console.log(results, 'results');
            if (results.length === 0) {
                res.render('responses', {
                    user: { name: req.cookies.loggedUser },
                    subs: [],
                    tests: [],
                    message: 'No results available for this test yet',
                    results: [],
                });
            } else {
                res.render('responses', {
                    user: { name: req.cookies.loggedUser },
                    subs: [],
                    tests: [],
                    attempts: results.length,
                    results: results,
                });
            }
        });
    } else {
        res.redirect('/login');
    }
});

app.post('/updatetest/:testID', (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        console.log(req.body);
        Question.deleteMany({ testId: req.params.testID }, (err, data) => {
            for (var question in req.body) {
                if (question != 'testname' && question != 'marks') {
                    var newQuestion = new Question({
                        testId: req.params.testID,
                        question: req.body[question][0],
                        options: [
                            req.body[question][1],
                            req.body[question][2],
                            req.body[question][3],
                            req.body[question][4],
                        ],
                        answer: req.body[question][5],
                        selected: '',
                        marks: req.body[question][6],
                    });
                    console.log(newQuestion, 'question');
                    newQuestion.save(function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Question added');
                        }
                    });
                }
            }
            res.redirect('/updatetests');
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/addtest', (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        Subject.find({}, (err, subjects) => {
            if (err) {
                console.log(err);
            } else {
                User.findOne({ name: req.cookies.loggedUser }, (err, user) => {
                    res.render('addtest', {
                        user: user,
                        subjects: subjects,
                    });
                });
            }
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/addtest/:subjectId', (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        Subject.findById(req.params.subjectId, (err, subject) => {
            res.render('testform', {
                subjectname: subject.name,
                subject: { id: req.params.subjectId },
                user: { name: req.cookies.loggedUser },
            });
        });
    } else {
        res.redirect('/login');
    }
});

app.post('/addtest/:subjectID', (req, res) => {
    console.log(req.body);
    console.log(req.params.subjectID);
    if (req.cookies.loggedUser && req.cookies.password) {
        // var testid = new mongoose.Types.ObjectId();
        var newTest = new Test({
            // _id: testid,
            subjectId: new mongoose.Types.ObjectId(req.params.subjectID),
            name: req.body.testname,
        });
        newTest.save(function (err, newUser) {
            if (err) {
                console.log(err);
            } else {
                for (var question in req.body) {
                    console.log(question);
                    console.log(req.body[question]);
                    if (question != 'testname' && question != 'marks') {
                        var newQuestion = new Question({
                            testId: newTest._id,
                            question: req.body[question][0],
                            options: [
                                req.body[question][1],
                                req.body[question][2],
                                req.body[question][3],
                                req.body[question][4],
                            ],
                            answer: req.body[question][5],
                            marks: req.body[question][6],
                            selected: '',
                        });
                        console.log(newQuestion, 'newQuestion');
                        newQuestion.save(function (err, newUser) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Question added');
                            }
                        });
                    }
                }
                res.redirect('/profile');
            }
        });
    } else {
        res.redirect('/login');
    }
});

app.post('/addsubject', blob.single('subImg'), (req, res) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        var newSubject = new Subject({
            name: req.body.subjectName,
            imgsrc: '/uploads/' + req.file.originalname.replace(' ', ''),
        });
        newSubject.save(function (err, newSubject) {
            console.log(newSubject);
        });
        res.redirect('/profile');
    } else {
        res.redirect('/login');
    }
});

app.post('/reguser', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var cnfpassword = req.body.cnfpassword;
    if (password === cnfpassword) {
        User.find({}, (err, users) => {
            var newUser = new User({
                name: username,
                password: password,
                email: req.body.email,
                access: 'student',
            });
            newUser.save(function (err, newUser) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('User added');
                    res.redirect('/login');
                }
            });
            console.log('registering...');
        });
    } else {
        res.render('register', { message: "Passwords don't match" });
    }
});

app.post('/getin', (req, response) => {
    console.log(req.body);
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                if (user.password === req.body.password) {
                    response.cookie('loggedUser', user.name);
                    response.cookie('password', user.password);
                    response.redirect('/home');
                } else {
                    response.render('login', { message: 'Invalid password' });
                }
            } else {
                response.render('login', { message: 'Invalid email' });
            }
        }
    });
});

app.get('/home', (req, res, isLoggedin) => {
    if (req.cookies.loggedUser && req.cookies.password) {
        Subject.find({}, (err, subjects) => {
            if (err) {
                console.log(err);
            } else {
                // console.log(subjects);
                res.render('home', { subs: subjects });
            }
        });
    } else {
        res.render('login', { message: 'login required' });
    }
});

app.get('/subject/:id', (req, res) => {
    console.log(req.params.id);
    Test.find({ subjectId: req.params.id }, (err, tests) => {
        // find all tests of a subject
        console.log(tests, 'tests');
        if (tests.length === 0) {
            res.render('tests', {
                tests: tests,
                message: 'No tests available',
            });
        } else {
            res.render('tests', { tests: tests });
        }
    });
});

app.get('/test/:id', (req, res) => {
    // console.log(req.params.id);
    Question.find({ testId: req.params.id }, (err, data) => {
        // find all tests of a subject
        // console.log(data, 'questions');
        res.render('exam', { questions: data });
    });
});

app.post('/genscore', (req, res) => {
    console.log(req.body);
    var score = 0;
    var answers = req.body;
    var resquestions = [];
    var questionids = [];
    for (var key in answers) {
        questionids.push(key);
    }
    if (questionids.length != 0) {
        Question.find(
            {
                _id: { $in: questionids },
            },
            (err, questions) => {
                if (err) {
                    console.log(err);
                } else {
                    for (var i = 0; i < questions.length; i++) {
                        if (questions[i].answer === answers[questions[i]._id]) {
                            score += questions[i].marks;
                            var correctquestion = questions[i];
                            correctquestion.selected = questions[i].answer;
                            resquestions.push(correctquestion);
                        } else {
                            var wrongquestion = questions[i];
                            wrongquestion.selected = answers[questions[i]._id];
                            console.log(wrongquestion, 'wrongquestion');
                            resquestions.push(wrongquestion);
                        }
                    }
                    var newResult = new Result({
                        testId: new mongoose.Types.ObjectId(
                            questions[0].testId
                        ),
                        userId: new mongoose.Types.ObjectId(
                            '6243fcc8e4b6b5a4e7edaa9d'
                        ),
                        questions: resquestions,
                        score: score,
                    });
                    newResult.save((err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // res.send({ score: score });
                            res.redirect('/results/' + result._id);
                        }
                    });
                }
            }
        );
    } else {
        res.send({
            score: score,
            message: 'No questions attempted go back and attempt quiz',
        });
    }
    // res.redirect('/result');
});

app.get('/results/:resultId', (req, res) => {
    console.log(req.params.resultId);
    Result.findById(req.params.resultId, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result, 'result');
        }
    })
        .clone()
        .then((result) => {
            console.log(result, 'resultpopulated');
            res.render('result', { result: result });
        });
});
app.get('/temp', (req, res) => {
    res.render('temp');
});
var port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log('Server started on port ' + port);
});
