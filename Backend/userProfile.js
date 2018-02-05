function profile(name, sock) {
    //Properties
    this.username = name;
    this.socketID = sock;
    this.chatPartner = undefined;
    this.partnerSocket = undefined;
}
profile.prototype.partnerDC = function() {
    this.chatPartner = undefined;
    this.partnerSocket = undefined;
}

profile.prototype.parterConnect = function(name, socket) {
    this.chatPartner = name;
    this.partnerSocket = socket;
}

profile.prototype.partnerSocket = function() {
    return this.partnerSocket;
}

profile.prototype.getName = function() {
    return this.username;
}

profile.prototype.getSocket = function() {
    return this.socketID;
}

module.exports = profile;