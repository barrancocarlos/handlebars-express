// set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var exphbs  = require('express-handlebars');     //handlebars


// Db connect =================
mongoose.connect('mongodb://localhost/handlebars');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
      // we're connected!
});

// define model =================

//new schema
var ProjectSchema = mongoose.Schema({
    name: String,
    activitie: String
});

//new model
var Project = mongoose.model('projects', ProjectSchema);

// configuration =================

    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride('_method'))               // put and delete
    app.engine('handlebars', exphbs({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');                                 // template engine
    app.use(express.static(__dirname + '/public'));
    app.use('/bower_components',  express.static(__dirname + '/bower_components'));


// routes =========================

//PAGES
    //index
    app.get('/', function(req, res, next) {
   var projects = Project.find().exec(function(err, data) {
        if(err) {
            return next(err);
        }
         console.log(data);
         res.render('index', { info: data});

    });
});

    //add route
    app.get('/add', function(req, res) {
        res.render('add');
    });

    app.get('/edit', function(req, res) {

        res.render('edit');

    });

//API

//get all projects
    app.get('/api', function(req, res, next) {
       var projects = Project.find().exec(function(err, data) {
            if(err) {
                return next(err);
            }
             console.log(data);
             res.json(data);

        });
    });

//get 1 project
    app.get('/api/:id', function(req, res, next) {
       var project = Project.findById(req.params.id, function(err, data) {
            if(err) {
                return next(err);
            }
             console.log(data);
             res.render('edit', { value: data})
             // res.json(data);

        });
    });

//Post new project
    app.post('/api', function(req, res, next) {
        var project = new Project({
           name: req.body.name,
           activitie: req.body.activitie
        });
        project.save(function(err, data) {
            if(err) {
                return next(err);
            }
            res.redirect('/');

         });

    });


//Delete project
    app.delete('/api/:id', function(req, res) {
       Project.findByIdAndRemove(req.params.id, function(err, data) {
            res.redirect('/');
        });

    });

//Update book
    app.put('/api/:id', function(req, res, next) {
        console.log("edit id");
        Project.findById(req.params.id, function(err, data) {
            data.name = req.body.name;
            data.activitie = req.body.activitie;
            data.save(function(err, data) {
                if(err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });



// Port ======================================================================
var port = "3000";
app.listen(port);
console.log("Magic happens at " + port);
