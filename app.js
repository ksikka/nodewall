
/**
 * Module dependencies.
 */

var express = require('express')
   ,routes = require('./routes')
   ,mongoose = require('mongoose')
   ,io = require('socket.io');

var app = module.exports = express.createServer()
   , io = io.listen(app);
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

// helpers
var validatesMaxLength = [function(s){ return s.length < 255; }, 'String too long' ];


// model
var Schema = mongoose.Schema;
var postSchema = new Schema( {
    name      :{type:String, required:true },
    message   :{type:String, required:true, validate:validatesMaxLength},
    created_on:{type:Date, default:Date.now}
});
var Post = mongoose.model('postSchema',postSchema);

// controller
function storeMessage(req,res) {
    if(req.body)
    {
        new Post({
            name:req.body.name,
            message:req.body.message}).save(function(err){
                if(!err) {
                    res.send(true);
                    console.log("Saved a post: "+ Date.now().toString());
                } else {
                    res.send(false);
                }
            });
    }
    else res.send(false);
}


// Routes

app.get('/', function(req,res) {
    console.log("GET request to root");
    Post.find().sort('created_on',1).exec(
            function(err,docs) {
                res.render('index',{
                    posts : docs,
                    title : "The NodeWall" });
            }
    );
});

/* This is the route for adding posts. 
 * This should be spam filtered eventually.*/
app.post('/post', storeMessage);

/* This is for refreshing the wall on the client side */
app.get('/wall.html',function(req,res){
    Post.find().sort('created_on', 1).exec(
            function(err, docs) {res.partial('wall',{posts : docs });
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
  
io.sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
      console.log("someone posted a message, gonna broadcast now");
      socket.broadcast.emit('refresh',true);
  });
});

