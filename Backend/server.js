var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var users = {};
var Profile = require("./userProfile");

app.use(express.static(path.join(__dirname, '/../')));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/../main.html"));
});

io.on('connection', (socket) => {
    console.log("A user connected");
    socket.on("nameChosen", (name) => {
        var go = true;
        for(i in users) {
            console.log(i);
            if(users[i].getName().toLowerCase() == name.toLowerCase()) {
                socket.emit("nameback", false);
                go = false;
            }
        }
        if(go) {
            socket.emit("nameback", true);
            users[socket.id] = new Profile(name, socket.id);
        }
    });
    socket.on("connToUser", (name) => {
        var go = true;
        console.log("Searching for name");
        if(name == users[socket.id].getName()) {
            go = false;
            socket.emit("userConnected", "");
        }
        for(x in users) {
            if(users[x].getName().toLowerCase() == name.toLowerCase() && go == true) {
                var otherUser = users[socket.id];
                users[x].parterConnect(otherUser.getName(), otherUser.getSocket());
                users[socket.id].parterConnect(name, users[x].getSocket());
                socket.emit("userConnected", name);
                io.to(users[socket.id].partnerSocket).emit("userConnected", users[socket.id].getName());
                go = false;
            }
        }
        if(go) {
            socket.emit("userConnected", false);
        }
    })
    socket.on("msg", (data) => {
        io.to(users[socket.id].partnerSocket).emit("incomingMsg", data);
    });
    socket.on('disconnect', () => {
        console.log("User disconnected");
        if(users[socket.id] == undefined) {
            return;
        }
        console.log(users[socket.id]);
        if(users[socket.id].partnerSocket != undefined) {
            io.to(users[socket.id].partnerSocket).emit("partnerDC", users[socket.id].getName());
            users[users[socket.id].partnerSocket].partnerDC();
        }
        delete users[socket.id];
    });
});

http.listen(3000, () => {
    console.log("listening");
});