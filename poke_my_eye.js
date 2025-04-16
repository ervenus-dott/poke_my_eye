var canvas = document.getElementById("eye-canvas");
var context = canvas.getContext("2d");
var greenNormal = document.getElementById("green-normal");
var greenThree = document.getElementById("green-3");
var lightBlueMagentaBlue = document.getElementById("light-blue-magenta-blue");
var lightBlueYellowBlue = document.getElementById("light-blue-yellow-blue");
var orangeMagentaBlue = document.getElementById("orange-magenta-blue");
var orangeYellowBlue = document.getElementById("orange-yellow-blue");
var redBlob = document.getElementById("red-blob");

context.drawImage(greenNormal, 21, 71);
context.drawImage(greenThree, 21, 71);
context.drawImage(lightBlueMagentaBlue, 21, 71);
context.drawImage(lightBlueYellowBlue, 21, 71);
context.drawImage(orangeMagentaBlue, 21, 71);
context.drawImage(orangeYellowBlue, 21, 71);
context.drawImage(redBlob, 21, 71);

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
var drawXAtMouse = function(evt) {
    var pos = getMousePos(canvas, evt);

    context.fillStyle = "blue";
    context.font = "48px serif";
    context.fillText("X",(pos.x -18),(pos.y + 18));
}
canvas.addEventListener('mousedown' ,drawXAtMouse);



