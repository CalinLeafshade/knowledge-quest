$(function(){function a(){$(".piece").remove(),c.forEach(function(a){console.log("lol",a),$("<div>").addClass("piece").css({top:a.position[1]+"px",left:a.position[0]+"px","background-color":a.color}).appendTo("#board")})}var b=io(),c=[];b.on("update",function(b){console.log("update",b),c=b,a()}),b.on("move",function(a){c.find(function(b){return b.color==a.color})}),$("#board").on("click",function(a){var c=$(this).offset();b.emit("move",[a.pageX-c.left,a.pageY-c.top])})});
//# sourceMappingURL=app.js.map