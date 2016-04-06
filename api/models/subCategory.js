var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    relationship = require('mongoose-relationship');

var SCategory = new Schema({
    designation     : String,
    description     : String,
    _categoryId     : {type: Schema.Types.ObjectId, ref: 'Category', childPath:'subCats'},
    products        : [{type: Schema.Types.ObjectId, ref: 'Product'}],
    fields: [Schema.Types.Mixed]
});

SCategory.plugin(relationship, {relationshipPathName: '_categoryId'});
module.exports = mongoose.model('subCategory', SCategory);