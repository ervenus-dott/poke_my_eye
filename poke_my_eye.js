var canvas = document.getElementById("eye-canvas");
var context = canvas.getContext("2d");
var greenNormal = document.getElementById("green-normal");
var greenThree = document.getElementById("green-3");
var lightBlueMagentaBlue = document.getElementById("light-blue-magenta-blue");
var lightBlueYellowBlue = document.getElementById("light-blue-yellow-blue");
var orangeMagentaBlue = document.getElementById("orange-magenta-blue");
var orangeYellowBlue = document.getElementById("orange-yellow-blue");
var redBlob = document.getElementById("red-blob");


var blobProperties = {
    boundingBox: {
        topLeft: [43, 91],
        bottomRight: [226, 260],
    },
    eyes: [
        [165, 139],
        [201, 234],
        [126, 226],
        [68, 136],
    ],
};
var drawBlobCoords = function() {
    context.fillStyle = "orange";
    context.font = "36px serif";
    context.textBaseline = "middle";
    context.textAlign = "center";
    blobProperties.eyes.forEach(function(eye) {
        context.fillText("X", eye[0], eye[1]);
    })
    boxWidth = blobProperties.boundingBox.bottomRight[0] - blobProperties.boundingBox.topLeft[0];
    boxHeight = blobProperties.boundingBox.bottomRight[1] - blobProperties.boundingBox.topLeft[1];
    context.strokeRect(blobProperties.boundingBox.topLeft[0], blobProperties.boundingBox.topLeft[1], boxWidth, boxHeight);
}
greenNormal.addEventListener("load", function() {
    context.drawImage(greenNormal, 21, 71);
    // this is the properties for the 4 eyed green blob
    drawBlobCoords()
})
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
var vertexDistance = (a, b) => {
    var x = b[0]- a[0];
    var y = b[1]- a[1];
    return Math.sqrt(x * x + y * y);
};
var hitTest = function(a, b, radius) {
    var distance = vertexDistance(a, b);
    return distance <= radius;
};
var drawXAtMouse = function(evt) {
    var pos = getMousePos(canvas, evt);
    var mouseVertex = [pos.x, pos.y];
    blobProperties.eyes.forEach(function(eye, eyeIndex) {
        if(!hitTest(mouseVertex, eye, 20)) {
            return;
        }
        console.log('which eye did we click on', eye, eyeIndex);
        context.fillStyle = "blue";
        context.font = "48px serif";
        context.textBaseline = "middle";
        context.textAlign = "center";
        console.log('what is pos.x and pos.y, pos.clientX, pos.clientY', pos.x, pos.y, pos.clientX, pos.clientY);
        // context.fillText("X",(pos.x -18),(pos.y + 18));
        context.fillText("X",(pos.x),(pos.y));
    })

};
canvas.addEventListener('mousedown' ,drawXAtMouse);



