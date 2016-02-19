var express = require('express');
var multer = require('multer');
var shortid = require('shortid');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        console.log(shortid.generate());
        cb(null, shortid.generate());
    }
});

var upload = multer({
    storage: storage
});
var router = express.Router();

var mime = require('mime-types');

var mongoose = require('mongoose');
require('../models/Files.js');

var File = mongoose.model('File');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Hall Hall Server'
    });
});

router.get('/view', function(req, res, next) {
    File.find(function(err, files) {
        if (err) return next(err);

        res.render('files', {
            data: files,
            title: 'Hall Hall Server'
        });
    });
});

router.get('/upload', function(req, res, next) {
    res.render('upload', {
        title: 'Hall Hall Server'
    });
});

router.post('/upload', upload.single('rando'), function(req, res, next) {
    // console.log(req.file);
    var obj = {
        name: req.file.originalname,
        mime: req.file.mimetype,
        uploadId: req.file.filename
    };
    var file = new File(obj);
    file.save(function(err, post) {
        if (err) {
            return next(err);
        }

        res.redirect('/');
    });
});

router.get('/file/:id', function(req, res, next) {
    File.findOne({
        uploadId: req.params.id
    }, function(err, file) {
        if (err) return next(err);

        console.log(mime.extension(file.mime));
        // res.json(file);
        res.download('uploads/' + file.uploadId, file.name + '.' + mime.extension(file.mime));
    });


});

module.exports = router;
