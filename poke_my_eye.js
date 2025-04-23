var canvas = document.getElementById("eye-canvas");
var context = canvas.getContext("2d");
var greenNormal = document.getElementById("green-normal");
var greenThree = document.getElementById("green-3");
var lightBlueMagentaBlue = document.getElementById("light-blue-magenta-blue");
var lightBlueYellowBlue = document.getElementById("light-blue-yellow-blue");
var orangeMagentaBlue = document.getElementById("orange-magenta-blue");
var orangeYellowBlue = document.getElementById("orange-yellow-blue");
var redBlob = document.getElementById("red-blob");


var blobs = [
    {
        image: greenNormal,
        boundingBox: {
            topLeft: [0, 0],
            bottomRight: [226, 260],
        },
        eyes: [
            {pos: [146, 72.5250015258789], hit: false},
            {pos: [52, 60.525001525878906], hit: false},
            {pos: [102, 157.5250015258789], hit: false},
            {pos: [183, 163.5250015258789], hit: false},
        ],
    },    {
        image: greenThree,
        boundingBox: {
            topLeft: [100, 300],
            bottomRight: [200, 460],
        },
        eyes: [
            {pos: [152, 354.5250015258789], hit: false},
            {pos: [238, 393.5250015258789], hit: false},
            {pos: [184, 428.5250015258789], hit: false},
        ],
    }
];
var drawBlobCoords = function(blob) {
    context.drawImage(blob.image, blob.boundingBox.topLeft[0], blob.boundingBox.topLeft[1]);
    context.fillStyle = "magenta";
    context.font = "36px serif";
    context.textBaseline = "middle";
    context.textAlign = "center";
    blob.eyes.forEach(function(eye) {
        context.fillText("X", eye.pos[0], eye.pos[1]);
    })
    boxWidth = blob.boundingBox.bottomRight[0] - blob.boundingBox.topLeft[0];
    boxHeight = blob.boundingBox.bottomRight[1] - blob.boundingBox.topLeft[1];
    context.strokeRect(blob.boundingBox.topLeft[0], blob.boundingBox.topLeft[1], boxWidth, boxHeight);
};
var loadImagePromise = function(image) {
    return new Promise((resolve) => {
        if (image.complete) {
            resolve();
        } else {
            image.addEventListener("load", resolve)
        }
    })
};
var imagePromises = blobs.map((blob) => {
    return loadImagePromise(blob.image);
});
Promise.all(imagePromises).then(function() {
    // this is the properties for the 4 eyed green blob
    // drawBlobCoords(blobs[0])
    blobs.forEach(drawBlobCoords);
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
    console.log('what is pos.x and pos.y', pos.x, pos.y);
    blobs.forEach((blob)=>{
        blob.eyes.forEach(function(eye) {
            if (
                eye.hit ||
                !hitTest(mouseVertex, eye.pos, 20)
            ) {
                return;
            }
            // console.log('which eye did we click on', eye, eyeIndex);
            eye.hit = true;
            context.fillStyle = "blue";
            context.font = "48px serif";
            context.textBaseline = "middle";
            context.textAlign = "center";
            // context.fillText("X",(pos.x -18),(pos.y + 18));
            context.fillText("X",(pos.x),(pos.y));
        });
    });

};
canvas.addEventListener('mousedown' ,drawXAtMouse);



