var socket = io();
var otherName = "";
document.getElementById("username").addEventListener("keydown", (event) => {
    if( event.keyCode == 13) {
        submitUsername();
    }
});

function closePopup() {
    var mainBody = document.getElementById("main");
    mainBody.style.visibility = "visible";
    document.getElementById("login").style.visibility = "hidden";
    document.getElementById("msgToSend").addEventListener("keydown", (event) => {
        if( event.keyCode == 13) {
            console.log("sending msg");
            sendMsg();
        }
    });
    document.getElementById("otherName").addEventListener("keydown", (event) => {
        if( event.keyCode == 13) {
            connectToUser();
        }
    });
}

function submitUsername() {
    console.log("checking for name");
    socket.emit("nameChosen", document.getElementById("username").value);
    socket.on("nameback", (val) => {
        if(val == true) {
            closePopup();
        }
        else {
            console.log("name chosen already");
        }
    });
}

function connectToUser() {
    console.log("trying to connect");
    socket.emit("connToUser", document.getElementById("otherName").value);
    
}

//user connected
socket.on("userConnected", (res) => {
    if(res == false) {
        console.log("no user by that name");
    }
    else if(res == "") {
        document.getElementById("chatBox").innerHTML = "can't connect to self";
    }
    else {
        console.log("connected");
        document.getElementById("chatBox").innerHTML = "Connected to " + res;
        otherName = res;
    }
});

socket.on("incomingMsg", (data) => {
    document.getElementById("chatBox").appendChild(document.createElement("br"));
    document.getElementById("chatBox").appendChild(document.createTextNode(otherName + ": " + data));
});

socket.on("partnerDC", (data) => {
    document.getElementById("chatBox").appendChild(document.createElement("br"));
    document.getElementById("chatBox").appendChild(document.createTextNode(data + " disconnected"));

});

function sendMsg() {
    document.getElementById("chatBox").appendChild(document.createElement("br"));
    document.getElementById("chatBox").appendChild(document.createTextNode("You: " + document.getElementById("msgToSend").value));

    socket.emit("msg", document.getElementById("msgToSend").value);
    document.getElementById("msgToSend").value = "";
}