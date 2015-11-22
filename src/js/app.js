$(function () {

    var socket = io();
    var players = [];

    function updateBoard() {
        $('.piece').remove();
        players.forEach(function (p) {
            console.log('lol', p);
            $('<div>').addClass('piece').css({
                top: p.position[1] + "px",
                left: p.position[0] + "px",
                "background-color": p.color
            }).appendTo('#board');
        });
    }

    socket.on('update', function (data) {
        console.log('update', data);
        players = data;
        updateBoard();
    });

    socket.on('move', function (move) {
        var p = players.find(function (pl) {
            return pl.color == move.color;
        });
        if (p) {

        }
    });

    $('#board').on('click', function (e) {
        var offset = $(this).offset();
        socket.emit("move", [e.pageX - offset.left, e.pageY - offset.top]);
    });


});