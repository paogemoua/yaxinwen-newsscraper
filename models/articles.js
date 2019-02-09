var mongoose = require("mongoose");
var schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var articleSchema = new Schema({
    title: {
        type: String,
        required: true, 
        unique: true
    },
    dscription: {
        type: String,
        requied: true, 
        unique: true
    },
    saved: {
        type: Boolean,
        requied: true,
        default: false,
    },
    comments: [{
        type: Schema.ObjectId,
        ref: 'Comment'
    }]
});

articleSchema.virtual('categoryId').get(function() {
    return this._id;
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;