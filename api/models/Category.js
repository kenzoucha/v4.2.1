var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Category = new Schema({
    designation     :  String,
    description     :  String,
    subCats         : [{type: Schema.Types.ObjectId, ref: 'subCategory'}]
});
module.exports = mongoose.model('Category', Category);