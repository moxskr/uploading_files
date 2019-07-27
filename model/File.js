const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const File = new Schema({
    filename : {
        type : String,
        required : true
    },
    filepath : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('File', File);