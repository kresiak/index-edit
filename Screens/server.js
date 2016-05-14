var http = require('http');
var fs = require('fs');
var url = require('url');
var port = process.env.port || 1337;


var databaseFolder = __dirname + '\\database\\';
var fileDataFile = databaseFolder + 'files';

//var files = {};

// Low level utilies: Json file Database
// =====================================

function saveJson(filename, data) {
	fs.writeFile(filename, JSON.stringify(data), 'utf8', function (err) {
		if (err) throw err;
		console.log(filename + ' saved.');
	});
}

function loadOrInitializeJson(filename, cb) {
	fs.exists(filename, function (exists) {
		if (exists) {
			fs.readFile(filename, 'utf8', function (err, data) {
                if (err) throw err;
			    cb(JSON.parse(data.toString() || '{}'));
			    //cb(JSON.parse(data.toString() || {}));
			});
		} else {
			cb({});
		}
	});
}

function getAvailableIdForObject(object) {
	var keys;
	return Object.keys(object).length === 0 ? 1 : Number((keys = Object.keys(object))[keys.length - 1]) + 1;
}

// CRUD function factories
// =======================

function crudCreateFunctionFactory(filename) {
	return function (fileData, cb) {
		loadOrInitializeJson(filename, function (files) {
			var newid = getAvailableIdForObject(files);
			files[newid] = JSON.parse(fileData);
            saveJson(filename, files);
		    cb(newid);
		});
	}
}

function crudReadFunctionFactory(filename) {
	return function (id, cb) {
		loadOrInitializeJson(filename, function (files) {
			cb(files[id]);
		});
	}
}

function crudReadAllFunctionFactory(filename) {
	return function (cb) {
		loadOrInitializeJson(filename, function (files) {
			cb(files);
		});
	}
}

function crudUpdateFunctionFactory(filename) {
	return function (id, fileData, cb) {
		loadOrInitializeJson(filename, function (files) {
            if (Object.keys(files).indexOf(id) < 0)
                throw 'unknown id in FileData: ' + filename;
			files[id] = JSON.parse(fileData);
            saveJson(filename, files);
		    cb('OK');
		});
	}
}

function crudDeleteFunctionFactory(filename) {
	return function (id, cb) {
		loadOrInitializeJson(filename, function (files) {
            if (Object.keys(files).indexOf(id) < 0)
                throw 'unknown id in FileData: ' + filename;
			delete files[id];
            saveJson(filename, files);
            cb('OK');
		});
	}
}

// CRUD functions
// ===============

var dbCreateFileObject = crudCreateFunctionFactory(fileDataFile);
var dbReadFileObject = crudReadFunctionFactory(fileDataFile);
var dbReadAllFileObjects = crudReadAllFunctionFactory(fileDataFile);
var dbUpdateFileObject = crudUpdateFunctionFactory(fileDataFile);
var dbDeleteFileObject = crudDeleteFunctionFactory(fileDataFile);



http.createServer(function (req, res) {
    var item = '';
    var queryObject = url.parse(req.url, true).query;
	switch (req.method) {
		case 'POST':			
			req.setEncoding('utf8');
			req.on('data', function (chunk) {
				item += chunk;
			});
			req.on('end', function () {
				dbCreateFileObject(item, function(newid) {
                    console.log('new id: ' + newid);
                    res.end('OK\n');
				});			    
            });
            break;
        case 'GET':
            if (queryObject && queryObject.id) {
                dbReadFileObject(queryObject.id, function(record) {
                        res.end(JSON.stringify(record));
                    })
                    ;
            } else {
                dbReadAllFileObjects(function (files) {
                    res.end(JSON.stringify(files));
                });                
            }
            break;
        case 'PUT':
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
                item += chunk;
            });
            req.on('end', function () {
                if (queryObject && queryObject.id) {
                    dbUpdateFileObject(queryObject.id, item, function(retCode) {
                            res.end('OK\n');
                        })
                        ;
                }
            });
            break;
        case 'DELETE':
            if (queryObject && queryObject.id) {
                dbDeleteFileObject(queryObject.id, function (retCode) {
                    res.end('OK\n');
                })
                ;
            }
		default:
	}
	
	//res.writeHead(200, { 'Content-Type': 'text/plain' });
	//res.end('Hello World\n');
}).listen(port);

