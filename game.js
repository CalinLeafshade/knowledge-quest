module.exports = function (app, server) {

    var io = require('socket.io').listen(server);

    var colors = ["red", "green", "pink", "orange", "blue", "yellow", "purple", "grey", "darkred", "darkblue"];

    var players = [];

    function getData() {
        return players.map(function (p) {
            return {
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

    function newPlayer(socket) {
        var player = {
            socket: socket,
            color: nextColor(),
            position: [300, 300],
            wedges: []
        };
        socket.player = player;
        players.push(player);
        socket.emit('player', {
            color: player.color
        });
        socket.emit('update', getData());
        socket.on('disconnect', function () {
            console.log('user disconnected');
            players.splice(players.indexOf(player), 1);
            io.emit('update', getData());
        });
        socket.on('move', function (where) {
            var p = socket.player;
            p.position = where;
            io.emit('update', getData());
        });
        socket.on('wedge', function (wedges) {
            var p = socket.player;
            p.wedges = wedges;
            io.emit('update', getData());
        });
        socket.on('name', function (name) {
            console.log(name);
            var p = socket.player;
            p.name = name;
            io.emit('update', getData());
        });
        socket.on('roll', function () {
            var roll = Math.floor(Math.random() * 6) + 1;
            io.emit('roll', {
                player: {
                    name: socket.player.name,
                    color: socket.player.color
                },
                roll: roll
            });
        });
    }

    io.on('connection', function (socket) {
        console.log('a user connected');
        newPlayer(socket);

    });



}