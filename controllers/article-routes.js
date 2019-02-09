var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var Comment = require("../models/comments.js");
var Article = require("../models/articles.js");
var router = express.Router();

router.get("/scrape", function(req, res) {
    request("https://www.rfa.org/english/", function(error, response, html) {
        var $ = cheerio.load(html);
        $("div.frontcontent > single_column_teaser").each(function(i, element) {
            var result = {};
            result.title = $(element).children("single_column_teaser").children("h2").html();
            result.description = $(element).children("single_column_teaser").children("p").text();
            var entry = new Article(result);
            entry.save(function(err, doc) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log(doc);
                }
            });
        });
    res.redirect("/");
    });
});

router.post("/save/:id", function(req, res) {
    Article.findOneAndUpdate({"_id": req.params.id}, {"saved": true})
    .exec(function(err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("doc: ", doc);
        }
    });
});

router.post("/comment/:id", function(req, res) {
    var newComment = new Comment(req.body);
    newComment.save(function(error, newComment) {
        if (err) {
            console.log(err);
        }
        else {
            Article.findOneAndUpdate({"_id": req.params.id}, {$push: {"comments": newComment_id}}, {new: true})
            .exec(function(err, doc) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log("doc: ", doc);
                    res.send(doc);
                }
            });
        }
    });
});

router.post("/delete/:id", function(req, res) {
    Article.findOneAndUpdate({"_id": req.params.id}, {"saved": false})
    .exec(function(err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Article Deleted";)
        }
    });
    res.redirect("/saved");
});

module.exports = router;