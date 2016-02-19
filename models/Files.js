var mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({
    name: {type: String, required: true},
    mime: {type: String, required: true},
    uploadId: {type: String, unique: true, required: true},
    downloads: {type: Number, default: 0}
});

mongoose.model('File', FileSchema);
