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
// this is the properties for the 4 eyed green blob
var blobProperties = {
    boundingBox: {
        vertA: [43, 91],
        vertB: [226, 91],
        vertC: [226, 260],
        vertD: [43, 260],
    },
    eyes: {
        eye0: [165, 139],
        eye1: [201, 234],
        eye2: [126, 226],
        eye3: [68, 136]
    },
};
var drawBlobCoords = function() {
    context.fillStyle = "blue";
    context.font = "48px serif";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText("X", blobProperties.eyes.eye0[0],blobProperties.eyes.eye0[1]);
    context.fillText("X", blobProperties.eyes.eye1[0],blobProperties.eyes.eye1[1]);
    context.fillText("X", blobProperties.eyes.eye2[0],blobProperties.eyes.eye2[1]);
    context.fillText("X", blobProperties.eyes.eye3[0],blobProperties.eyes.eye3[1]);
    boxWidth = blobProperties.boundingBox.vertB[0] - blobProperties.boundingBox.vertA[0];
    boxHeight = blobProperties.boundingBox.vertC[1] - blobProperties.boundingBox.vertB[1];
    context.strokeRect(blobProperties.boundingBox.vertA[0], blobProperties.boundingBox.vertA[1], boxWidth, boxHeight);
}
drawBlobCoords()
// context.drawImage(greenThree, 21, 71);
// context.drawImage(lightBlueMagentaBlue, 21, 71);
// context.drawImage(lightBlueYellowBlue, 21, 71);
// context.drawImage(orangeMagentaBlue, 21, 71);
// context.drawImage(orangeYellowBlue, 21, 71);
// context.drawImage(redBlob, 21, 71);

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
        clientX: evt.clientX,
        clientY: evt.clientY,
    };
}
var drawXAtMouse = function(evt) {
    var pos = getMousePos(canvas, evt);

    context.fillStyle = "blue";
    context.font = "48px serif";
    context.textBaseline = "middle";
    context.textAlign = "center";
    console.log('what is pos.x and pos.y, pos.clientX, pos.clientY', pos.x, pos.y, pos.clientX, pos.clientY);
    // context.fillText("X",(pos.x -18),(pos.y + 18));
    context.fillText("X",(pos.x),(pos.y));
}
canvas.addEventListener('mousedown' ,drawXAtMouse);



