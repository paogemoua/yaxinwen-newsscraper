var express = require("express");
var exphs = require("express-handlebars");
var mongoose = require("mongoose");
var cherrio = require("cheerio");
var axios = require("axios");
var bodyParser = require("body-parser");
var request = require("request");

var Comment = require("./models/comments.js");
var Article = require("./models/articles.js");

var htmlRoute = require("./controllers/html-routes.js");
var articleRoute = require("./controllers/article-routes.js");

mongoose.Promise = Promise;

var port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.engine("handlebars", exphs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use("/", htmlRoute);
app.use("/", articleRoute);

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});

app.listen(port, function() {
    console.log("App running on port 3000!");
});