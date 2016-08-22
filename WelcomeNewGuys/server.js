var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var db;

var connectionUrl = 'mongodb://localhost:27017/giga';

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(connectionUrl, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    
    // Save database object from the callback for reuse.
    db = database;
    console.log("Database connection ready");
    
    //tmpInitData5();
    
    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

app.get("/data/:type", function (req, res) {
    db.collection(req.params.type).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, 'Failed to get ' + req.params.type + '.');
        } else {
            res.status(200).json(docs);
        }
    });
});

app.get("/data/:type/:id", function (req, res) {
    db.collection(req.params.type).findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get " + req.params.type);
        } else {
            res.status(200).json(doc);
        }
    });
});

app.post("/data/:type", function (req, res) {
    var newData = req.body;
    newData.createDate = new Date();
    
    db.collection(req.params.type).insertOne(newData, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new " + req.params.type);
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

app.post("/service/:type", function (req, res) {
    var parameter = req.body;
    
    switch (req.params.type) {
        case 'FindMatchingUsers':
            var firstname = parameter.firstname;
            var lastname = parameter.lastname;
            
            var cursor = db.collection('Employees').find({ "Prenom": firstname, "Nom": lastname });
            
            cursor.toArray(function (err, docs) {
                if (err) {
                    handleError(res, err.message, 'Failed to get service ' + req.params.type + '.');
                } else {
                    res.status(201).json(docs);
                }
            });
            
            break;
        case 'UpdateExamScore':
            var userId = parameter.userId;
            var presentationId = parameter.presentationId;
            var score = parameter.score;
            var passed = parameter.passed;

            db.collection('Employees').findOne({ _id: new ObjectID(userId) }, function (err, doc) {
                if (err) {
                    handleError(res, err.message, "Failed to get Employee" );
                } else {
                    if (doc) {
                        if (!doc.passedExams) {
                            doc.passedExams = {};                            
                        }
                        doc.passedExams[presentationId] = { 'score': score, 'passed': passed, 'date': new Date() };
                        
                        db.collection('Employees').updateOne({ _id: new ObjectID(userId) }, doc, function (err, doc) {
                            if (err) {
                                handleError(res, err.message, "Failed to update " + req.params.type);
                            } else {
                                res.status(204).end();
                            }
                        });
                    }
                }
            });
            break;
        case 'UpdatePiAnswer':
            var userId = parameter.userId;
            var piId = parameter.piId;
            var piAnswer = parameter.piAnswer;
            if (piAnswer.AllowMode === 'no') {
                piAnswer = {'AllowMode': 'no', dateUpdate: new Date()}; // delete all other fields
            }
            
            db.collection('Employees').findOne({ _id: new ObjectID(userId) }, function (err, doc) {
                if (err) {
                    handleError(res, err.message, "Failed to get Employee");
                } else {
                    if (doc) {
                        doc.piAnswers = doc.piAnswers || {};
                        doc.piAnswers[piId] = piAnswer;
                        
                        db.collection('Employees').updateOne({ _id: new ObjectID(userId) }, doc, function (err, doc) {
                            if (err) {
                                handleError(res, err.message, "Failed to update " + req.params.type);
                            } else {
                                res.status(204).end();
                            }
                        });
                    }
                }
            });
            break;
        default:
    }
});


app.put("/data/:type/:id", function (req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;
    
    db.collection(req.params.type).updateOne({ _id: new ObjectID(req.params.id) }, updateDoc, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update " + req.params.type);
        } else {
            res.status(204).end();
        }
    });
});

app.delete("/data/:type/:id", function (req, res) {
    db.collection(req.params.type).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete " + req.params.type);
        } else {
            res.status(204).end();
        }
    });
});

// ===========================================================
// Unused Stuff
// ===========================================================

function tmpInitData() {
    var collection = db.collection("Employees");
    
    var employees = [{
            'Nom': 'Kvasz', 
            'Prenom': 'Alexander',
            'email': 'kasssalex@gmail.com'
        }, {
            'Nom': 'Karim', 
            'Prenom': 'Latifa',
            'email': 'lkarim@hotmail.com'
        }];
    
    collection.insert(employees, function (error, result) {
        if (!error) {
            console.log("Success :" + result.ops.length + " employees inserted!");
        } else {
            console.log("Some error was encountered!");
        }
        
        db.close();
    });
}

function tmpInitData2() {
    var collection = db.collection("PIs");
    
    var employees = [{
            'Nom': 'Georges', 
            'Prenom': 'Michel',
            'email': 'kasssalex@gmail.com'
        }, {
            'Nom': 'Copieters', 
            'Prenom': 'Wouter',
            'email': 'kasssalex@gmail.com'
        }, {
            'Nom': 'Delcourt', 
            'Prenom': 'Paulette',
            'email': 'kasssalex@gmail.com'
        }, {
            'Nom': 'Magnée', 
            'Prenom': 'Christobald',
            'email': 'kasssalex@gmail.com'
        }
    ];
    
    collection.insert(employees, function (error, result) {
        if (!error) {
            console.log("Success :" + result.ops.length + " pis2 inserted!");
        } else {
            console.log("Some error was encountered!");
        }
        
        db.close();
    });
}



function tmpInitData3() {
    var collection = db.collection("Presentations");
    
    var presentations = [{
            'title': 'Introduction to the GIGA Institute', 
            'url': 'IntroGiga',
            'exam': [
                {
                    'question' : 'GIGA stands for...',
                    'responses': ['Grappe Interdisciplinaire de Génoprotéomique Appliquée', 'Grande inquiétude générale acquise', 'Génétique indépendante générale associée'],
                    'correct': 0
                },
                {
                    'question' : 'The present director of Giga is...',
                    'responses': ['Sandrina Evrard', 'Alexander Kvasz', 'Michel Georges'],
                    'correct': 2
                },            
                {
                    'question' : 'What is a PI?',
                    'responses': ['Principal Informator', 'Principal Investigator', '3.14'],
                    'correct': 1
                }
            ],
            'examMinimalScore' : 2
        }, 
        {
            'title': 'Legal obligations when working at the GIGA Institute', 
            'url': 'LegalGiga',
            'exam': [
                {
                    'question' : 'I am allowed to',
                    'responses': ['Steal computers', 'Talk to people', 'Paint the walls'],
                    'correct': 1
                },
                {
                    'question' : 'What is a PI?',
                    'responses': ['Principal Informator', 'Principal Investigator', '3.14'],
                    'correct': 1
                }
            ],
            'examMinimalScore' : 2
        },         
        {
            'title': 'Working at the GIGA Institute – everyday life', 
            'url': 'EveryDayGiga',
            'exam': [
            ],
            'examMinimalScore' : 0
        }
    ];
    
    collection.insert(presentations, function (error, result) {
        if (!error) {
            console.log("Success :" + result.ops.length + " pis2 inserted!");
        } else {
            console.log("Some error was encountered!");
        }
        
        db.close();
    });
}

function tmpInitData4() {
    var collection = db.collection("Platforms");
    
    var employees = [
        {
            'Nom': 'Imaging & Cell Cytometry', 
            'Locations': [
                {
                    'Batiment': 'B34',
                    'Etage': '+4'                
                },
                {
                    'Batiment': 'B36',
                    'Etage': '+1'
                }
            ]
        }, 
        {
            'Nom': 'Viral Vector', 
            'Locations': [
                {
                    'Batiment': 'B34',
                    'Etage': '+4'
                },
                {
                    'Batiment': 'B34',
                    'Etage': '+1'
                }
            ]
        }, 
        {
            'Nom': 'Zebrafish', 
            'Locations': [
                {
                    'Batiment': 'B34',
                    'Etage': '+1'
                },
                {
                    'Batiment': 'B34',
                    'Etage': '-2'
                }
            ]
        }, 
        {
            'Nom': 'Genomics', 
            'Locations': [
                {
                    'Batiment': 'B34',
                    'Etage': '+1'
                }
            ]
        }, 
        {
            'Nom': 'Mice Facilities & Transgenics SPF', 
            'Locations': [
                {
                    'Batiment': 'B34',
                    'Etage': '+1'
                },
                {
                    'Batiment': 'B34',
                    'Etage': '-2'
                }
            ]
        }, 
        {
            'Nom': 'Animal Facilities (conventional)', 
            'Locations': [
                {
                    'Batiment': 'B23'
                }
            ]
        }, 
        {
            'Nom': 'Immunohistochemistry', 
            'Locations': [
                {
                    'Batiment': 'B23'
                }
            ]
        }, 
        {
            'Nom': 'Proteomics', 
            'Locations': [
                {
                    'Batiment': 'B6'
                }
            ]
        } 
    ];
    
    collection.insert(employees, function (error, result) {
        if (!error) {
            console.log("Success :" + result.ops.length + " platforms inserted!");
        } else {
            console.log("Some error was encountered!");
        }
        
        db.close();
    });
}

function tmpInitData5() {
    var collection = db.collection("Facilities");
    
    var employees = [
        {
            'Nom': 'Centrifugeuses'
        }, 
        {
            'Nom': 'Culture cellules eucaryotes'
        }, 
        {
            'Nom': 'Labo Techniques'
        }, 
        {
            'Nom': 'Labo biochimie'
        }, 
        {
            'Nom': 'RNA (Hotte)'
        }, 
        {
            'Nom': 'qPCR'
        }, 
        {
            'Nom': 'Electrophorèse et caméras'
        }, 
        {
            'Nom': 'Labo -80C'
        }
    ];
    
    collection.insert(employees, function (error, result) {
        if (!error) {
            console.log("Success :" + result.ops.length + " platforms inserted!");
        } else {
            console.log("Some error was encountered!");
        }
        
        db.close();
    });
}

