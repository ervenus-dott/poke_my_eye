import './styles.css'
const canvas: HTMLCanvasElement = document.getElementById('eye-canvas') as HTMLCanvasElement
const context = canvas.getContext('2d') as CanvasRenderingContext2D
const blobCounterText = document.getElementById('blob-count') as HTMLElement
const scoreText = document.getElementById('score') as HTMLElement

type Vec2 = [number, number]
type Eye = {
  pos: Vec2
  hit: boolean
}
type Blawb = {
  name: string
  image: number
  velocity: Vec2
  topLeftCorner: Vec2
  dimensions: Vec2
  eyes: Eye[]
}

const images: HTMLImageElement[] = []

const blobSources: Blawb[] = [
  {
    name: 'greenNormal',
    image: 0,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [226, 206.5250015258789],
    eyes: [
      { pos: [52, 60.525001525878906], hit: false },
      { pos: [146, 72.5250015258789], hit: false },
      { pos: [183, 163.5250015258789], hit: false },
      { pos: [102, 157.5250015258789], hit: false },
    ],
  },
  {
    name: 'greenThree',
    image: 1,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [200, 176.5250015258789],
    eyes: [
      { pos: [53, 52.525001525878906], hit: false },
      { pos: [144, 88.5250015258789], hit: false },
      { pos: [86, 128.5250015258789], hit: false },
    ],
  },
  {
    name: 'lightBlueMagentaBlue',
    image: 2,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [314, 382.5250015258789],
    eyes: [
      { pos: [52, 132.5250015258789], hit: false },
      { pos: [207, 130.5250015258789], hit: false },
      { pos: [160, 306.5250015258789], hit: false },
      { pos: [67, 224.5250015258789], hit: false },
    ],
  },
  {
    name: 'lightBlueYellowBlue',
    image: 3,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [391, 308.1666717529297],
    eyes: [
      { pos: [104, 151.1666717529297], hit: false },
      { pos: [275, 138.1666717529297], hit: false },
      { pos: [200, 243.1666717529297], hit: false },
      { pos: [69, 205.1666717529297], hit: false },
    ],
  },
  {
    name: 'orangeMagentaBlue',
    image: 4,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [284, 259.1666717529297],
    eyes: [
      { pos: [77, 81.16667175292969], hit: false },
      { pos: [223, 68.16667175292969], hit: false },
      { pos: [192, 147.1666717529297], hit: false },
      { pos: [81, 215.1666717529297], hit: false },
    ],
  },
  {
    name: 'orangeYellowBlue',
    image: 5,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [350, 327.1666717529297],
    eyes: [
      { pos: [82, 157.1666717529297], hit: false },
      { pos: [234, 98.16667175292969], hit: false },
      { pos: [278, 224.1666717529297], hit: false },
      { pos: [135, 262.1666717529297], hit: false },
    ],
  },
  {
    name: 'redBlob',
    image: 6,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [246, 130.1666717529297],
    eyes: [
      { pos: [90, 47.16667175292969], hit: false },
      { pos: [184, 43.16667175292969], hit: false },
      { pos: [160, 86.16667175292969], hit: false },
      { pos: [57, 93.16667175292969], hit: false },
    ],
  },
]
let blobCount: number = 0
let score: number = 0
const updateBlobText = function () {
  blobCounterText.innerText = blobCount + ' blobs'
}
const updateScoreText = function () {
  scoreText.innerText = 'score is: ' + score
}
const blobCounter = (blobBoolean: boolean) => {
  if (blobBoolean) {
    blobCount += 1
    updateBlobText()
    // console.log('what is blobCount', blobCount)
  } else {
    blobCount -= 1
    updateBlobText()
    score += Math.ceil(Math.random() * 60 + 20)
    updateScoreText()
    // console.log('what is blobCount', blobCount)
    // console.log('what is score', score)
  }
}
/*const drawImageForDimensionTesting = (width: number, height: number) => {
  context.drawImage(redBlob, 0, 0)
  context.lineWidth = 15
  context.strokeStyle = 'red'
  context.strokeRect(0, 0, width, height)
}
drawImageForDimensionTesting(246, 130.1666717529297)*/

type BlawbImageData = {
  prefix: string
  eyeCount: number
  bodyImage?: HTMLImageElement
  eyeImages?: HTMLImageElement[]
  eyeImagesClosed?: HTMLImageElement[]
  eyeImagesScrunched?: HTMLImageElement[]
}
const blawbImageData: BlawbImageData[] = [
  { prefix: '/eye-blob-groups/green_yellow_blue-eyes/', eyeCount: 4 },
  { prefix: '/eye-blob-groups/green_yellow_blue_three-eyes/', eyeCount: 3 },
  { prefix: '/eye-blob-groups/light-blue_magenta_blue-eyes/', eyeCount: 4 },
  { prefix: '/eye-blob-groups/light-blue_yellow_magenta-eyes/', eyeCount: 4 },
  { prefix: '/eye-blob-groups/orange_magenta_blue-eyes/', eyeCount: 4 },
  { prefix: '/eye-blob-groups/orange_yellow_blue-eyes/', eyeCount: 4 },
  { prefix: '/eye-blob-groups/red_magenta_blue-eyes/', eyeCount: 4 },
]
const makeImageFromPath = (imagePath: string): HTMLImageElement => {
  const image = new Image()
  image.src = imagePath
  return image
}
const preloadImages = function () {
  blawbImageData.forEach((imageGroup) => {
    const prefix = imageGroup.prefix
    const eyeCount = imageGroup.eyeCount
    const bodyImage = makeImageFromPath(prefix + 'body.png')
    images.push(bodyImage)
    imageGroup.bodyImage = bodyImage
    imageGroup.eyeImages = []
    imageGroup.eyeImagesClosed = []
    imageGroup.eyeImagesScrunched = []
    for (let eyeIndex = 0; eyeIndex < eyeCount; eyeIndex += 1) {
      let image = makeImageFromPath(prefix + `eye-${eyeIndex}.png`)
      images.push(image)
      imageGroup.eyeImages.push(image)
      image = makeImageFromPath(prefix + `eye-${eyeIndex}-closed.png`)
      images.push(image)
      imageGroup.eyeImagesClosed.push(image)
      image = makeImageFromPath(prefix + `eye-${eyeIndex}-scrunched.png`)
      images.push(image)
      imageGroup.eyeImagesScrunched.push(image)
    }
  })
  console.log('what is blawbImageData', blawbImageData)
}
preloadImages()

const jsonClone = (src: object): object => JSON.parse(JSON.stringify(src))
let blobs: Blawb[] = []
const makeRandomBlob = (): void => {
  const index = Math.floor(Math.random() * blobSources.length)
  const sourceBlob = blobSources[index]
  const clonedBlob = jsonClone(sourceBlob) as Blawb
  clonedBlob.velocity = vertexScale([Math.random() * 2 - 1, Math.random() * 2 - 1], 100)
  clonedBlob.topLeftCorner[0] = Math.random() * (canvas.width - clonedBlob.dimensions[0])
  clonedBlob.topLeftCorner[1] = Math.random() * (canvas.height - clonedBlob.dimensions[1])
  blobs.push(clonedBlob)
  blobCounter(true)
}

setInterval(makeRandomBlob, 5000)
const drawBlawb = function (blob: Blawb) {
  const topLeftX = blob.topLeftCorner[0]
  const topLeftY = blob.topLeftCorner[1]
  // const width = blob.dimensions[0]
  // const height = blob.dimensions[1]
  const blawbImageGroup = blawbImageData[blob.image]
  const bodyImage = blawbImageGroup.bodyImage as HTMLImageElement
  context.drawImage(bodyImage, topLeftX, topLeftY)
  context.font = '48px monospace'
  context.textBaseline = 'middle'
  context.textAlign = 'center'
  context.strokeStyle = '#000'
  context.lineWidth = 5
  blob.eyes.forEach(function (eye, eyeIndex) {
    const eyePropertyArrayName = eye.hit ? 'eyeImagesClosed' : 'eyeImages'
    const eyeImages = blawbImageGroup[eyePropertyArrayName] as HTMLImageElement[]
    const eyeImage = eyeImages[eyeIndex] as HTMLImageElement
    context.drawImage(eyeImage, topLeftX, topLeftY)
    context.fillStyle = eye.hit ? 'blue' : 'magenta'
    context.strokeText('' + eyeIndex, topLeftX + eye.pos[0], topLeftY + eye.pos[1])
    context.fillText('' + eyeIndex, topLeftX + eye.pos[0], topLeftY + eye.pos[1])
  })
  // context.lineWidth = 15
  // context.strokeStyle = 'red'
  // context.strokeRect(topLeftX, topLeftY, width, height)
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
const renderLoop = (time: number): void => {
  const delta = (lastTime - time) / 1000
  requestAnimationFrame(renderLoop)
  context.clearRect(0, 0, canvas.width, canvas.height)
  blobs = blobs.filter(isBlobAlive)
  if (blobCount > blobs.length) {
    blobCounter(false)
  }
  blobs.forEach((blob) => {
    // const blobPhase = (phase + blob.phase) * blob.speed
    bounce(blob, delta)
  })
  blobs.forEach(drawBlawb)
  lastTime = time
}
Promise.all(imagePromises).then(function () {
  makeRandomBlob()
  requestAnimationFrame(renderLoop)
})

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
const vertexScale = (a: Vec2, scale: number): Vec2 => {
  return [a[0] * scale, a[1] * scale]
}
const vertexDistance = (a: Vec2, b: Vec2): number => {
  const x = b[0] - a[0]
  const y = b[1] - a[1]
  return Math.sqrt(x * x + y * y)
}
const bounce = (blob: Blawb, delta: number) => {
  const velocityDelta = vertexScale(blob.velocity, delta)
  blob.topLeftCorner = vertexAdd(blob.topLeftCorner, velocityDelta)
  const bottomRight = vertexAdd(blob.topLeftCorner, blob.dimensions)
  if (blob.topLeftCorner[0] < 0 || bottomRight[0] > canvas.width) {
    blob.velocity[0] *= -1
  }
  if (blob.topLeftCorner[1] < 0 || bottomRight[1] > canvas.height) {
    blob.velocity[1] *= -1
  }
}
const hitTest = function (a: Vec2, b: Vec2, radius: number) {
  const distance = vertexDistance(a, b)
  return distance <= radius
}

const drawXAtMouse = function (evt: MouseEvent) {
  const pos = getMousePos(canvas, evt)
  const mouseVertex: Vec2 = [pos.x, pos.y]
  // console.log('what is pos.x and pos.y', pos.x, ',', pos.y)
  blobs.forEach((blob) => {
    blob.eyes.forEach(function (eye) {
      const eyePosition = vertexAdd(blob.topLeftCorner, eye.pos)
      if (eye.hit || !hitTest(mouseVertex, eyePosition, 20)) {
        return
      }
      // console.log('which eye did we click on', eye, eyeIndex);
      eye.hit = true
    })
  })
}
canvas.addEventListener('mousedown', drawXAtMouse)
