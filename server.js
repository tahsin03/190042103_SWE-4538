var express = require('express');

var app = express();


var server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port);
   });


app.use(express.static(__dirname));

var mongoose = require("mongoose");

DATABASE_URL = "mongodb+srv://tahsin03:tahsin127@cluster0.2ymswez.mongodb.net/test"

mongoose.connect(DATABASE_URL , (err) => { 
    console.log("mongodb connected",err);
 })

var Message = mongoose.model('Messages',{ sender : String, reciever : String, message : String})

var bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
  })

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      res.sendStatus(200);
    })
  })

var http = require("http").Server(app);
var io = require("socket.io")(http);

io.on("connection", () =>{
  console.log("a user is connected")
 })

 app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})