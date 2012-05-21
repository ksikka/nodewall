
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var mongoose = require('mongoose');

var app = module.exports = express.createServer();
mongoose.connect('mongodb://localhost/test');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// model
var Schema = mongoose.Schema;
var postSchema = new Schema( {
    name      :{type:String, default:"Anonymous"},
    message   :{type:String},
    created_on:{type:Date, default:Date.now}
});
var Post = mongoose.model('postSchema',postSchema);

// controller
function storeMessage(req,res) {
    if(req.body)
    {
        new Post({
            name:req.body.name,
            message:req.body.message}).save(function(){
                res.send(true);
                console.log("Saved a post: "+ Date.now.toString());
            });
    }
    else
        res.send(false);
}


// Routes

app.get('/', function(req,res) {
    console.log("GET request to root");
    Post.find(
            {},
            function(err, docs) {
                res.render('index',{
                    posts : docs,
                    title : "Espresso"
                });
            }
    );
});
app.post('/post', storeMessage);


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
