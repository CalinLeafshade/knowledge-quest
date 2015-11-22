module.exports = function (app, server) {

    var io = require('socket.io').listen(server);
    var uuid = require('node-uuid');

    var colors = ["red", "green", "pink", "orange", "blue", "yellow", "purple", "grey", "darkred", "darkblue"];

    var players = [];

    function getData() {
        return players.map(function (p) {
            return {
                id: p.id,
                position: p.position,
                color: p.color,
                wedges: p.wedges,
                name: p.name
            }
        });
    }

    function findColor(socket) {
        return players.find(function (p) {
            return p.socket == socket;
        }).color;
    }

    function findPlayer(socket) {
        return players.find(function (p) {
            return p.socket == socket;
        })
    }

    function nextColor() {
        var playerColors = players.map(function (p) {
            return p.color
        });
        var c = colors.find(function (cc) {
            return playerColors.indexOf(cc) == -1;
        });
        return c || "white";
    }

    function sendUpdate() {
        io.emit('update', getData());
    }

    function newConnection(socket) {

        socket.on('disconnect', function () {
            if (socket.player) {
                players.splice(players.indexOf(socket.player), 1);
                io.emit('update', getData());
            }
        });
        socket.on('join', function (name) {
            var id = uuid.v4();
            var player = {
                id: id,
                color: nextColor(),
                wedges: [],
                name: name,
                position: [800, 800]
            };
            socket.player = player;
            players.push(player);
            sendUpdate();
            socket.emit('accept', player);
        });
        socket.on('move', function (where) {
            var p = socket.player;
            if (p) {
                p.position = where;
                sendUpdate();
            }
        });
        socket.on('wedge', function (wedges) {
            var p = socket.player;
            if (p) {
                p.wedges = wedges;
                sendUpdate();
            }
        });
        socket.on('roll', function () {
            var roll = Math.floor(Math.random() * 6) + 1;
            if (socket.player) {
                io.emit('roll', {
                    player: {
                        name: socket.player.name,
                        color: socket.player.color
                    },
                    roll: roll
                });
            }
        });
        sendUpdate(socket);

    }

    io.on('connection', function (socket) {
        console.log('a user connected');
        newConnection(socket);

    });



}