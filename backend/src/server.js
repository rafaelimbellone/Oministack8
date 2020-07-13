const express = require('express');
const mongoose = require('mongoose');
const routes = require("./router");
const cors   = require('cors');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;
  connectedUsers[user] = socket.id;
  console.log(user, socket.id);  
});

mongoose.connect('mongodb+srv://oministack8:rafael321@cluster0-5qcu3.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use((req, rest, next) => {
   req.io = io;
   req.connectedUsers = connectedUsers;
   return next();
});

//servidor reconhecer as requisiçoes JSON.
app.use(express.json());

//servidor buscar as rotas.
app.use(cors());
app.use(routes);

// porta de acesso
server.listen(3333);