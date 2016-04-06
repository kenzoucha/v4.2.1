var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    relationship = require('mongoose-relationship');

var Media = new Schema({
    name            : String,
    _productId      :{type: Schema.Types.ObjectId, ref: 'Product', childPath: 'images'}
});

Media.plugin(relationship, {relationshipPathName: '_productId'});
module.exports = mongoose.model('Media', Media);