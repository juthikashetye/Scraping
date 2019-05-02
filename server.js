// Dependencies
require("dotenv").config();
var fs = require('fs');
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var bodyParser = require('body-parser');
// Initialize Express
var app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

// Database configuration
var databaseUrl = "newsScraper";
var collections = ["scrapedNews"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Retrieve all news from the db
app.get("/news", function(req, res) {

  // Find all results from the scrapedNews collection in the db
  db.scrapedNews.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Retrieve all comments data from the db
app.get("/all-comments", function(req, res) {

  // Find all results from the scrapedNews collection in the db
  db.comments.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});


app.delete("/comment/:id", function(req, res) {
  var id = req.params.id;

  db.comments.remove({
    "_id": mongojs.ObjectID(id)
  }, function(error, removed) {
    if (error) {
      res.send(error);
    } else {
      res.json(id);
    }
  });
});

// Handle form submission, save submission to mongo
app.post("/addComment", function(req, res) {
  
  // Insert the comment into the comments collection
  db.comments.insert({
    comment: req.body.comment
  }, function(error, savedComment) {
    // Log any errors
    if (error) {
      console.log(error);
    } else {
      //the reason why we are sending the savedComment back is because 
      //we now have an _id to give to the client
      res.json(savedComment);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {

  // Make a request via axios for the news section of `theonion`
  axios.get("https://www.theonion.com/c/news-in-brief").then(function(response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);

    // fs.writeFileSync('stuff.txt', response.data);

    // For each element with a ".item__text" class

    $(".item__text").each(function(i, element) {

      var title = $(element).children("h1").children("a").children("div").text();
      var link = $(element).children("h1").children("a").attr("href");
      var story = $(element).children(".entry-summary").children("p").text();

      console.log(title);
      console.log(link);
      console.log(story);

      // If this found element had both a title and a link
      if (link && title && story) {
        // Insert the data in the scrapedNews db
        db.scrapedNews.insert({
            link: link,
            title: title,
            story: story
          },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            } else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
          });
      }
    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});