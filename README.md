# Scraping

### Overview

This is a web app that lets users view, add and delete comments on the latest news.

### Before You Begin

1. Clone this repo to your computer.

2. In the terminal navigate to the root of this repo and run `npm install`. When that's finished, you should have these npm packages in your `node_modules` folder:

* express

* axios

* ejs

* mongojs

* body-parser

* cheerio

* request

3. After the installation run `nodemon server.js` from the terminal in the root folder and this should start the app on http://localhost:3000/

## Working of the app

  1. Whenever a user visits your site, the app can scrape stories from the news outlet [the ONION](https://www.theonion.com/c/news-in-brief) and display them for the user. The app should scrape and display the following information for each article:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article

  2. Users should also be able to leave comments on the articles displayed. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.