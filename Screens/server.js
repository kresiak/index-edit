var http = require('http');
var fs = require('fs');
var url = require('url');
var port = process.env.port || 1337;


var databaseFolder = __dirname + '\\database\\';

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

// routing
// =======

var defaultRouteCmd = 'files';

function getRouteInfo(parsedUrl) {
    var path = parsedUrl.path.substring(1);
    var cmd = '';
    var id = '';
    var pathParts = path.split('/');
    if (pathParts.length === 0) {
        cmd = defaultRouteCmd;
    } else {
        cmd = pathParts[0];
        if (cmd === '') {
            cmd = defaultRouteCmd;
        }
        if (pathParts.length > 1) {
            id = pathParts[1];
        }
    }

    return {
        cmd: cmd,
        id: id,
        getFileName: function() {
            return databaseFolder + cmd;
        }
    };
}

// helper methods
// ===============

function collectAllData(req, cb) {
    var item = '';
    req.setEncoding('utf8');

    req.on('data', function (chunk) {
        item += chunk;
    });
    req.on('end', function () {
        cb(item);
    });
}

http.createServer(function (req, res) {
    var routeInfo = getRouteInfo(url.parse(req.url, true));
    res.setHeader("Access-Control-Allow-Origin", "*");

	switch (req.method) {
        case 'POST':
            collectAllData(req, function (data) {
                crudCreateFunctionFactory(routeInfo.getFileName())(data, function (newid) {
                        console.log('new id: ' + newid);
                        res.end('OK\n');
                    });
                });
            break;
        case 'PUT':
            if (routeInfo.id) {
                collectAllData(req, function(data) {
                    crudUpdateFunctionFactory(routeInfo.getFileName())(routeInfo.id, data, function(retCode) {
                                res.end('OK\n');
                            });
                    });
            }
            break;
        case 'GET':
            if (routeInfo.cmd === defaultRouteCmd) {
                if (routeInfo.id) {
                    var stream = fs.createReadStream(__dirname + '\\files\\' + routeInfo.id);
                    stream.pipe(res);
                } else {
                    var files = fs.readdirSync(__dirname + '\\files\\');
                    res.end(JSON.stringify(files));                    
                }
            } else {
                if (routeInfo.id) {
                    crudReadFunctionFactory(routeInfo.getFileName())(routeInfo.id, function (record) {
                        res.end(JSON.stringify(record));
                    })
                    ;
                } else {
                    crudReadAllFunctionFactory(routeInfo.getFileName())(function (files) {
                        res.end(JSON.stringify(files));
                    });
                }                
            }
            break;
        case 'DELETE':
            if (routeInfo.id) {
                crudDeleteFunctionFactory(routeInfo.getFileName())(routeInfo.id, function (retCode) {
                    res.end('OK\n');
                })
                ;
            }
		default:
	}
	
	//res.writeHead(200, { 'Content-Type': 'text/plain' });
	//res.end('Hello World\n');
}).listen(port);

