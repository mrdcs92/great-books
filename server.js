var express = require('express');
var bodyparser = require('body-parser');

// Create new express application
var app = express();

// Use Handlebars for templates
app.set('view engine', 'hbs');

// Log request info
app.use(function(req, res, next) {
  console.log('%s %s %s %s',
    new Date(), req.ip, req.path, req.get('User-Agent'));
  next();
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Enable basic parsing of <form> post bodies
app.use(bodyparser.urlencoded({
  extended: false
}));

// Store site-wide information for templates
app.locals.site = {
  name: 'Great Books',
  source: 'https://github.com/mrdcs92/great-books',
  author: {
    firstname: "Dylan",
    lastname: "Smith"
  }
};

// Initialize the book database
var booklist = [];

//
// Register application routes
//

// Respond to the base path
app.get('/', function(req, res) {
  res.render('index', {
    title: 'Welcome!',
    books: booklist
  });
});

app.post('/', function(req, res) {

  // Save the book if the user submitted something
  var titleSubmitted = req.body && req.body.title && req.body.title.trim();
  if(titleSubmitted) {
    booklist.push({
      title: req.body.title.trim()
    });
   
    // if the title submitted is equal to any of the titles in the array,
    // pop the element that was just submitted
    if (booklist.length > 1) {
      var length = booklist.length - 1;
      for (var i = 0; i < length; i++) {
        if (booklist[i]['title'] === titleSubmitted) {
          booklist.pop();
          res.render('index', {
            title: 'Welcome',
            message: 'Sorry, your submission is already a part of our list!',
            books: booklist
          });
        }
      }
      
    }
    else {
      res.render('index', {
        title: 'Welcome',
        message: 'Thank you for your submission!',
        books: booklist
      });
    }
  }
});

// Start the server
var port = process.env.PORT || 3000;
var address = process.env.IP || '127.0.0.1';
app.listen(port, address, function() {
  console.log('%s listening at http://%s:%s',
    app.locals.site.name, address, port);
});