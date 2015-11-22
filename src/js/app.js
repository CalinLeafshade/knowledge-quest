$(function () {

    var socket = io();
    var players = [];

    function updateBoard() {
        $('.piece').remove();
        players.forEach(function (p) {
            console.log('lol', p);
            var $elem = $('<div>').addClass('piece').css({
                top: p.position[1] + "px",
                left: p.position[0] + "px",
                "background-color": p.color
            })

            p.wedges.forEach(function (w) {
                $('<div>').addClass("wedge").addClass(w).appendTo($elem);
            });
            $('<label>').text(p.name).appendTo($elem);

            $elem.appendTo('#board');
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

    socket.on('roll', function (data) {
        var name = data.player.name || data.player.color;
        $('#roll-text').text(name + " rolled a " + data.roll);
    });

    socket.on('player', function (player) {
        $("#stat").text("You are " + player.color);
    });

    $('#board').on('click', function (e) {
        var offset = $(this).offset();
        socket.emit("move", [e.pageX - offset.left, e.pageY - offset.top]);
    });

    $('.wedge-checkbox').prop('checked', false);

    $('.wedge-checkbox').on('change', function (ev) {

        var values = [];
        $('.wedge-checkbox').each(function (i, e) {
            var $e = $(e);
            if (e.checked) {
                values.push($e.data('color'));
            }
        });
        socket.emit("wedge", values);

    });

    $('#txtName').on('change keypress', function (ev) {
        socket.emit('name', $(this).val());
    });

    $('#roll').on('click', function () {
        socket.emit('roll');
    });


});