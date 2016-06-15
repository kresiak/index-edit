var express = require('express');
var app = express();
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});

var uploading = multer({
    //dest: 'public/uploads/'
    storage: storage
});


router.post('/upload', uploading.any(), function(req, res) {
    req;
});

module.exports = router;

app.use('/', router);
app.use(express.static('public'));
//app.use(uploading.any());
app.listen(3002);