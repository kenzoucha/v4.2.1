var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    relationship = require('mongoose-relationship');

var Product = new Schema({
    designation     : String,
    description     : String,
    price           : Number,
    fields          : Schema.Types.Mixed,
    images          : [{type: Schema.Types.ObjectId, ref: 'Media'}],
    _scategoryId    : {type: Schema.Types.ObjectId, ref: 'subCategory',childPath:'products'}
});
Product.plugin(relationship, {relationshipPathName: '_scategoryId'});
module.exports = mongoose.model('Product', Product);