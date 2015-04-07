var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./app/models/bear');


mongoose.connect('mongodb://localhost/restfulapi')
//configure app to use bodyparse
//this lets us get data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

//Routes for our API


var router = express.Router();
//middleware to use for all request

router.use(function(req, res, next) { // all we need to do to declare middleware is this <<, and order matters in how we define our routes
 //do logging
 console.log('Something is happening...');
 next(); // to go onto the next route, so we dont get stuck here
});
//test route to make sure everything is working (get our GET at localhost)

router.get('/', function(req, res) {
   res.json({ message: 'Welcome to the legend'});
});

// more routes for our api will happen here
//Register our routes here ---------
router.route('/bears')

.get(function(req, res) {
  Bear.find(function(error, bears) {
    if (error) res.send(error);
    res.json(bears);
  });
});

router.route('/bears')
    //create a bear (which can be accessed at post http://localhost/8080/api/bear
.post(function(req, res) {

  var bear = new Bear(); //creating a new instance of our bear model or schema
  bear.name = req.body.name; // set the name from the request

//save the bear and check for errors
   bear.save(function(error) {
    if (error) res.send(error);
    res.json({ message: 'Bear created!'});
  });
});

//on routes that end in /bears/:bear_id
router.route('bears/:bear_id')

//get the bear with that id
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(error, bear) {
           if(error) res.send(error);
           res.json(bear);
     });
  });


router.route('bears/:bear_id')

   .put(function(req, res) {
       
      //Use our bear model to find the bear we want
      Bear.findById(req.params.bear_id,function(err, bear) {
          if (err)
              res.send(err);
          bear.name = req.body.name;

          //save the bear
          bear.save(function(err) {
              if(err) 
                 res.send(err);
              res.json({message: 'Bear updated!'});
          });
      });
  });
//we want all our routes to be prefixed with /api
app.use('/api', router);

//start the server!!
//==============================
app.listen(port);
console.log("Listening on port " + port);
