// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  text: String,
  image: String
});

mongoose.model('Article', ArticleSchema);
