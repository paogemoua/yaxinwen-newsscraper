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

app.get("/", (req, res) => {

    res.render("inbox");
});

app.get("/scrape", (reg, res) => {
    axios.get("https://www.rfa.org/english/").then((response) => {
        var $ = cheerio.load(response.data);
        $("span.no_media").each(function(i, element) {
            var result = {};
            
            result.title = $(this).text();
            result.link = $(this).children("a").attr("href");
            result.summary = $(this).siblings("p").text();

            db.Article.create(result).then((dbArticle) => {

            }).catch((err) => res.json(err));
        });
        res.redirect("/articles");
    });
});

app.get("/articles", (req, res) => {
    db.Article.find({}).then((dbArticle)) => {
        res.render("index", { dbArticle })
    }).catch((err) => {
        res.json(err);
    });
})

app.get("/articles/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id})
    .populate("note").then((dbArticle) => {
        res.json(dbArticle);
    })
    .catch((err) => {
        res.json(err);
    })
})

app.post("/article/:id", (req, res) => {
    db.Note.create(req.body).then((dbNote) => db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true}))
    .then((dbArticle) => {res.json(dbArticle);
    })
    .catch((err) => {
        res.json(err);
    })
});

app.delete("/articles/:id", (req, res) => {
    db.Note.remove().then((dbNote) => {
        res.json(dbNote);
    })
    .catch((err) => {
        res.json(err);
    })
});

app.listen(PORT, () => {
    console.log(`App running on port ${ PORT }! Refer to ${ PORT } for the app.`);
});

