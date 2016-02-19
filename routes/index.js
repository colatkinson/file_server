var express = require('express');
var multer = require('multer');
var shortid = require('shortid');
var path = require('path');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, shortid.generate());
    }
});

var upload = multer({
    storage: storage
});
var router = express.Router();

var mime = require('mime-types');

var fs = require('fs');

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
    var obj = {
        name: req.body.name,
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

        res.set('Content-Type', file.mime);
        res.set('Content-Disposition', 'attachment; filename=' + file.name + '.' + mime.extension(file.mime));
        fs.readFile(path.join(__dirname, '../uploads/', file.uploadId), function(err, data) {
            if(err) return next(err);

            res.send(data);
        });
    });


});

module.exports = router;
