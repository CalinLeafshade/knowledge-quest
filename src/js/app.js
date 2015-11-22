(function () {

    var app = angular.
    module('knowledge-quest', ['btford.socket-io']).
    factory('mySocket', function (socketFactory) {
        return socketFactory();
    }).
    controller('MainCtrl', MainController);

    app.factory('socket', ['$rootScope', function ($rootScope) {
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    }]);

    MainController.$inject = ['mySocket'];

    function MainController(mySocket) {
        var socket = mySocket;
        var vm = this;
        vm.joined = false;
        vm.me = null;
        vm.name = null;
        vm.players = [];
        vm.join = join;
        vm.moveClick = moveClick;
        vm.lastRoll = null;
        vm.rollDice = rollDice;
        vm.wedgeColors = ["blue", "pink", "brown", "yellow", "green", "orange"];
        vm.pieceColors = {
            "red": "#F22613",
            "green": "#26A65B",
            "pink": "#F64747",
            "orange": "#F89406",
            "blue": "#4183D7",
            "yellow": "#F4D03F",
            "purple": "#663399",
            "grey": "#6C7A89",
            "darkred": "#96281B",
            "darkblue": "#1F3A93"
        }
        vm.toggleWedge = toggleWedge;

        function toggleWedge(wedge) {
            if (vm.me.wedges.indexOf(wedge) > -1) {
                vm.me.wedges = _.without(vm.me.wedges, wedge);
            } else {
                vm.me.wedges.push(wedge);
            }
            socket.emit('wedge', vm.me.wedges);
        }

        function rollDice() {
            if (vm.joined) {
                socket.emit('roll');
            }
        }

        function moveClick(ev) {
            if (vm.joined) {
                socket.emit('move', [ev.offsetX, ev.offsetY]);
            }
        }

        function join() {
            if (vm.name) {
                socket.emit('join', vm.name);
            }
        }

        socket.on('accept', function (player) {
            vm.me = player;
            vm.joined = true;
        });

        socket.on('update', function (data) {
            // remove missing players
            for (var i = vm.players.length - 1; i >= 0; i--) {
                if (data.find(function (d) {
                        return d.id == vm.players[i].id
                    }) == null) {
                    vm.players.splice(i, 1);
                }
            }
            data.forEach(function (d) {
                var p = vm.players.find(function (p) {
                    return p.id == d.id
                });
                if (!p) {
                    p = d;
                    vm.players.push(p);
                }
                p.position = d.position;
                p.name = d.name;
                p.wedges = d.wedges;
                p.color = d.color;
                if (vm.me) {
                    if (p.id == vm.me.id) {
                        vm.me = p;
                    }
                }
            });
        });

        socket.on('roll', function (val) {
            vm.lastRoll = {
                who: val.player.name,
                roll: val.roll
            }
        });

    }




})();




//$(function () {
//
//    var socket = io();
//    var players = [];
//
//    function updateBoard() {
//        $('.piece').remove();
//        players.forEach(function (p) {
//            console.log('lol', p);
//            var $elem = $('<div>').addClass('piece').css({
//                top: p.position[1] + "px",
//                left: p.position[0] + "px",
//                "background-color": p.color
//            })
//
//            p.wedges.forEach(function (w) {
//                $('<div>').addClass("wedge").addClass(w).appendTo($elem);
//            });
//            $('<label>').text(p.name).appendTo($elem);
//
//            $elem.appendTo('#board');
//        });
//    }
//
//    socket.on('update', function (data) {
//        console.log('update', data);
//        players = data;
//        updateBoard();
//    });
//
//    socket.on('move', function (move) {
//        var p = players.find(function (pl) {
//            return pl.color == move.color;
//        });
//        if (p) {
//
//        }
//    });
//
//    socket.on('roll', function (data) {
//        var name = data.player.name || data.player.color;
//        $('#roll-text').text(name + " rolled a " + data.roll);
//    });
//
//    socket.on('player', function (player) {
//        $("#stat").text("You are " + player.color);
//    });
//
//    $('#board').on('click', function (e) {
//        var offset = $(this).offset();
//        socket.emit("move", [e.pageX - offset.left, e.pageY - offset.top]);
//    });
//
//    $('.wedge-checkbox').prop('checked', false);
//
//    $('.wedge-checkbox').on('change', function (ev) {
//
//        var values = [];
//        $('.wedge-checkbox').each(function (i, e) {
//            var $e = $(e);
//            if (e.checked) {
//                values.push($e.data('color'));
//            }
//        });
//        socket.emit("wedge", values);
//
//    });
//
//    $('#txtName').on('change keypress', function (ev) {
//        socket.emit('name', $(this).val());
//    });
//
//    $('#roll').on('click', function () {
//        socket.emit('roll');
//    });
//
//
//});