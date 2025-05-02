import './styles.css'
const canvas: HTMLCanvasElement = document.getElementById('eye-canvas') as HTMLCanvasElement
const context = canvas.getContext('2d') as CanvasRenderingContext2D
const greenNormal = document.getElementById('green-normal') as HTMLImageElement
const greenThree = document.getElementById('green-3') as HTMLImageElement
const lightBlueMagentaBlue = document.getElementById('light-blue-magenta-blue') as HTMLImageElement
/*
const lightBlueYellowBlue = document.getElementById("light-blue-yellow-blue") as HTMLImageElement;
const orangeMagentaBlue = document.getElementById("orange-magenta-blue") as HTMLImageElement;
const orangeYellowBlue = document.getElementById("orange-yellow-blue") as HTMLImageElement;
const redBlob = document.getElementById("red-blob") as HTMLImageElement;
*/

type Vec2 = [number, number]

type Eye = {
  pos: Vec2
  hit: boolean
}

type Blawb = {
  image: number
  phase: number
  topLeftCorner: Vec2
  dimensions: Vec2
  eyes: Eye[]
}
const images: HTMLImageElement[] = [greenNormal, greenThree, lightBlueMagentaBlue]
const blobSources: Blawb[] = [
  {
    image: 0,
    phase: 0,
    topLeftCorner: [0, 0],
    dimensions: [226, 206.5250015258789],
    eyes: [
      { pos: [146, 72.5250015258789], hit: false },
      { pos: [52, 60.525001525878906], hit: false },
      { pos: [102, 157.5250015258789], hit: false },
      { pos: [183, 163.5250015258789], hit: false },
    ],
  },
  {
    image: 1,
    phase: 0,
    topLeftCorner: [0, 0],
    dimensions: [200, 176.5250015258789],
    eyes: [
      { pos: [53, 52.525001525878906], hit: false },
      { pos: [144, 88.5250015258789], hit: false },
      { pos: [86, 128.5250015258789], hit: false },
    ],
  },
  {
    image: 2,
    phase: 0,
    topLeftCorner: [0, 0],
    dimensions: [314, 382.5250015258789],
    eyes: [
      { pos: [52, 132.5250015258789], hit: false },
      { pos: [207, 130.5250015258789], hit: false },
      { pos: [160, 306.5250015258789], hit: false },
      { pos: [67, 224.5250015258789], hit: false },
    ],
  },
]
const jsonClone = (src: object): object => JSON.parse(JSON.stringify(src))
let blobs: Blawb[] = []
const makeRandomBlob = (): void => {
  const index = Math.floor(Math.random() * blobSources.length)
  const sourceBlob = blobSources[index]
  const clonedBlob = jsonClone(sourceBlob) as Blawb
  clonedBlob.phase = Math.random() * Math.PI * 2
  clonedBlob.topLeftCorner[0] = Math.random() * (canvas.width - clonedBlob.dimensions[0])
  clonedBlob.topLeftCorner[1] = Math.random() * (canvas.height - clonedBlob.dimensions[1])
  blobs.push(clonedBlob)
}
makeRandomBlob()
setInterval(makeRandomBlob, 5000)
const drawBlobCoords = function (blob: Blawb) {
  const topLeftX = blob.topLeftCorner[0]
  const topLeftY = blob.topLeftCorner[1]
  const width = blob.dimensions[0]
  const height = blob.dimensions[1]
  const image = images[blob.image]
  context.drawImage(image, topLeftX, topLeftY)
  context.font = '36px serif'
  context.textBaseline = 'middle'
  context.textAlign = 'center'
  blob.eyes.forEach(function (eye) {
    context.fillStyle = eye.hit ? 'blue' : 'magenta'
    context.fillText('X', topLeftX + eye.pos[0], topLeftY + eye.pos[1])
  })
  context.lineWidth = 15
  context.strokeStyle = 'red'
  context.strokeRect(topLeftX, topLeftY, width, height)
}
const loadImagePromise = function (image: HTMLImageElement) {
  return new Promise<void>((resolve) => {
    if (image.complete) {
      resolve()
    } else {
      image.addEventListener('load', () => {
        resolve()
      })
    }
  })
}
const imagePromises = images.map(loadImagePromise)
const isEyeHit = (eye: Eye) => eye.hit
const isBlobAlive = (blob: Blawb) => !blob.eyes.every(isEyeHit)

let lastTime = 0
let phase = 0
const renderLoop = (time: number): void => {
  const delta = (lastTime - time) / 1000
  phase += delta
  requestAnimationFrame(renderLoop)
  context.clearRect(0, 0, canvas.width, canvas.height)
  blobs = blobs.filter(isBlobAlive)
  blobs.forEach((blob) => {
    const blobPhase = phase + blob.phase * 2
    blob.topLeftCorner[0] += Math.cos(blobPhase)
    blob.topLeftCorner[1] += Math.sin(blobPhase)
  })
  blobs.forEach(drawBlobCoords)
  lastTime = time
}
Promise.all(imagePromises).then(function () {
  requestAnimationFrame(renderLoop)
})
// context.drawImage(greenThree, 21, 71);
// context.drawImage(lightBlueMagentaBlue, 21, 71);
// context.drawImage(lightBlueYellowBlue, 21, 71);
// context.drawImage(orangeMagentaBlue, 21, 71);
// context.drawImage(orangeYellowBlue, 21, 71);
// context.drawImage(redBlob, 21, 71);

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
    clientX: evt.clientX,
    clientY: evt.clientY,
  }
}
const vertexAdd = (a: Vec2, b: Vec2): Vec2 => {
  return [a[0] + b[0], a[1] + b[1]]
}
const vertexDistance = (a: Vec2, b: Vec2): number => {
  const x = b[0] - a[0]
  const y = b[1] - a[1]
  return Math.sqrt(x * x + y * y)
}
const hitTest = function (a: Vec2, b: Vec2, radius: number) {
  const distance = vertexDistance(a, b)
  return distance <= radius
}

// TODO: fix the eye clicking so that it works for multiple blobs.
// Current version seems to only work with a single blob.
const drawXAtMouse = function (evt: MouseEvent) {
  const pos = getMousePos(canvas, evt)
  const mouseVertex: Vec2 = [pos.x, pos.y]
  console.log('what is pos.x and pos.y', pos.x, pos.y)
  blobs.forEach((blob) => {
    blob.eyes.forEach(function (eye) {
      const eyePosition = vertexAdd(blob.topLeftCorner, eye.pos)
      if (eye.hit || !hitTest(mouseVertex, eyePosition, 20)) {
        return
      }
      // console.log('which eye did we click on', eye, eyeIndex);
      eye.hit = true
      context.fillStyle = 'blue'
      context.font = '48px serif'
      context.textBaseline = 'middle'
      context.textAlign = 'center'
      // context.fillText("X",(pos.x -18),(pos.y + 18));
      context.fillText('X', pos.x, pos.y)
    })
  })
}
canvas.addEventListener('mousedown', drawXAtMouse)
