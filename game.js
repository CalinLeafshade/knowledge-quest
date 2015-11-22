module.exports = function (app, server) {

    var io = require('socket.io').listen(server);

    var colors = ["red", "green", "pink", "orange", "blue"];

    var players = [];

    function getData() {
        return players.map(function (p) {
            return {
                position: p.position,
                color: p.color
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

    function newPlayer(socket) {
        var player = {
            socket: socket,
            color: colors[players.length],
            position: [300, 300]
        };
        players.push(player);
        socket.emit('update', getData());
        socket.on('disconnect', function () {
            console.log('user disconnected');
            players.splice(players.indexOf(player), 1);
            io.emit('update', getData());
        });
        socket.on('move', function (where) {
            var p = findPlayer(socket);
            p.position = where;
            io.emit('update', getData());
        });
    }

    io.on('connection', function (socket) {
        console.log('a user connected');
        newPlayer(socket);

    });



}