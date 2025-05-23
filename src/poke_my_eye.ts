import './styles.css'
const canvas: HTMLCanvasElement = document.getElementById('eye-canvas') as HTMLCanvasElement
const context = canvas.getContext('2d') as CanvasRenderingContext2D
const blobCounterText = document.getElementById('blob-count') as HTMLElement
const scoreText = document.getElementById('score') as HTMLElement
const healthText = document.getElementById('health') as HTMLElement

type Vec2 = [number, number]
type Eye = {
  pos: Vec2
  hitFrame: number
}
type Blawb = {
  name: string
  image: number
  spawnTimer: number
  velocity: Vec2
  topLeftCorner: Vec2
  dimensions: Vec2
  eyes: Eye[]
}

const images: HTMLImageElement[] = []
const sfx: Record<string, HTMLAudioElement> = {
  squish0: new Audio('sfx/squish0.mp3'),
  blobDeath: new Audio('sfx/blob_death.mp3'),
  blobDespawn: new Audio('sfx/blob_despawn.mp3'),
}

const blobSources: Blawb[] = [
  {
    name: 'greenNormal',
    image: 0,
    spawnTimer: 0,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [226, 206.5250015258789],
    eyes: [
      { pos: [52, 60.525001525878906], hitFrame: 0 },
      { pos: [146, 72.5250015258789], hitFrame: 0 },
      { pos: [183, 163.5250015258789], hitFrame: 0 },
      { pos: [102, 157.5250015258789], hitFrame: 0 },
    ],
  },
  {
    name: 'greenThree',
    image: 1,
    spawnTimer: 0,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [200, 176.5250015258789],
    eyes: [
      { pos: [53, 52.525001525878906], hitFrame: 0 },
      { pos: [144, 88.5250015258789], hitFrame: 0 },
      { pos: [86, 128.5250015258789], hitFrame: 0 },
    ],
  },
  {
    name: 'lightBlueMagentaBlue',
    image: 2,
    spawnTimer: 0,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [314, 382.5250015258789],
    eyes: [
      { pos: [52, 132.5250015258789], hitFrame: 0 },
      { pos: [207, 130.5250015258789], hitFrame: 0 },
      { pos: [160, 306.5250015258789], hitFrame: 0 },
      { pos: [67, 224.5250015258789], hitFrame: 0 },
    ],
  },
  {
    name: 'lightBlueYellowBlue',
    image: 3,
    spawnTimer: 0,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [391, 308.1666717529297],
    eyes: [
      { pos: [104, 151.1666717529297], hitFrame: 0 },
      { pos: [275, 138.1666717529297], hitFrame: 0 },
      { pos: [200, 243.1666717529297], hitFrame: 0 },
      { pos: [69, 205.1666717529297], hitFrame: 0 },
    ],
  },
  {
    name: 'orangeMagentaBlue',
    image: 4,
    spawnTimer: 0,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [284, 259.1666717529297],
    eyes: [
      { pos: [77, 81.16667175292969], hitFrame: 0 },
      { pos: [223, 68.16667175292969], hitFrame: 0 },
      { pos: [192, 147.1666717529297], hitFrame: 0 },
      { pos: [81, 215.1666717529297], hitFrame: 0 },
    ],
  },
  {
    name: 'orangeYellowBlue',
    image: 5,
    spawnTimer: 0,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [350, 327.1666717529297],
    eyes: [
      { pos: [82, 157.1666717529297], hitFrame: 0 },
      { pos: [234, 98.16667175292969], hitFrame: 0 },
      { pos: [278, 224.1666717529297], hitFrame: 0 },
      { pos: [135, 262.1666717529297], hitFrame: 0 },
    ],
  },
  {
    name: 'redBlob',
    image: 6,
    spawnTimer: 0,
    velocity: [0, 0],
    topLeftCorner: [0, 0],
    dimensions: [246, 130.1666717529297],
    eyes: [
      { pos: [90, 47.16667175292969], hitFrame: 0 },
      { pos: [184, 43.16667175292969], hitFrame: 0 },
      { pos: [160, 86.16667175292969], hitFrame: 0 },
      { pos: [57, 93.16667175292969], hitFrame: 0 },
    ],
  },
]
let blobCount: number = 0
let score: number = 0
let health: number = 1000
let healthCounter: number = 1000
const updateBlobText = function () {
  blobCounterText.innerText = blobCount + ' blobs'
}
const updateScoreText = function () {
  const value = String(score)
  if (scoreText.innerText !== value) {
    scoreText.innerText = value
  }
}
const updateHealthText = function () {
  const value = String(health)
  if (healthText.innerText !== value) {
    healthText.innerText = value
  }
}
updateScoreText()
updateHealthText()
const tau: number = Math.PI * 2
const triangleSize: number = 50
const spikeSpacing: number = tau / 3
const centerPosition: Vec2 = [canvas.width / 2, canvas.height / 2]
const triangleCenterPos: Vec2 = [centerPosition[0] - canvas.width * 0.02, centerPosition[1]]
const drawStartScreen = function () {
  context.beginPath()
  context.font = '50px monospace'
  context.textBaseline = 'middle'
  context.textAlign = 'center'
  context.lineWidth = 5
  context.strokeStyle = '#2bb393'
  context.fillStyle = '#2bb393'
  context.fillText('Click Triangle', centerPosition[0], centerPosition[1] - canvas.height * 0.2)
  context.fillText('to Start Game', centerPosition[0], centerPosition[1] + canvas.height * 0.2)
  for (let i = 0; i < 3; i++) {
    const spikeAngle = i * spikeSpacing
    context.lineTo(
      triangleCenterPos[0] + Math.cos(spikeAngle) * triangleSize,
      triangleCenterPos[1] + Math.sin(spikeAngle) * triangleSize,
    )
  }

  context.closePath()
  context.fill()
}
const drawLoadingScreen = function () {
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.beginPath()
  context.font = '50px monospace'
  context.textBaseline = 'middle'
  context.textAlign = 'center'
  context.lineWidth = 5
  context.strokeStyle = '#2bb393'
  context.fillStyle = '#2bb393'
  context.fillText('Game is Loading', centerPosition[0], centerPosition[1] - canvas.height * 0.2)
  context.fillText('Please Wait', centerPosition[0], centerPosition[1] + canvas.height * 0.2)
  context.closePath()
  context.fill()
}
const drawEndScreen = function () {
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.beginPath()
  context.font = 'bold 50px monospace'
  context.textBaseline = 'middle'
  context.textAlign = 'center'
  context.lineWidth = 5
  context.fillStyle = '#c30000'
  context.strokeStyle = '#c30000'
  context.fillText('GAME OVER', centerPosition[0], centerPosition[1] - canvas.height * 0.05)
  context.font = '30px monospace'
  context.strokeStyle = '#000000'
  // context.fillText('', centerPosition[0], centerPosition[1] + canvas.height * 0.05)
  context.fillText(
    `score was ${Math.max(0, score)}`,
    centerPosition[0],
    centerPosition[1] + canvas.height * 0.05,
  )

  context.closePath()
  context.fill()
}
drawStartScreen()
// drawEndScreen()

const blobCounter = (blobBoolean: boolean) => {
  if (blobBoolean) {
    blobCount += 1
    // console.log('what is blobCount', blobCount)
  } else {
    blobCount -= 1
    sfx.blobDeath.volume = 0.25
    sfx.blobDeath.play()
    // console.log('what is blobCount', blobCount)
    // console.log('what is score', score)
  }
  updateBlobText()
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
  { prefix: 'eye-blob-groups/green_yellow_blue-eyes/', eyeCount: 4 },
  { prefix: 'eye-blob-groups/green_yellow_blue_three-eyes/', eyeCount: 3 },
  { prefix: 'eye-blob-groups/light-blue_magenta_blue-eyes/', eyeCount: 4 },
  { prefix: 'eye-blob-groups/light-blue_yellow_magenta-eyes/', eyeCount: 4 },
  { prefix: 'eye-blob-groups/orange_magenta_blue-eyes/', eyeCount: 4 },
  { prefix: 'eye-blob-groups/orange_yellow_blue-eyes/', eyeCount: 4 },
  { prefix: 'eye-blob-groups/red_magenta_blue-eyes/', eyeCount: 4 },
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
  clonedBlob.spawnTimer = 1000
  clonedBlob.velocity = vertexScale([Math.random() * 2 - 1, Math.random() * 2 - 1], 100)
  clonedBlob.topLeftCorner[0] = Math.random() * (canvas.width - clonedBlob.dimensions[0])
  clonedBlob.topLeftCorner[1] = Math.random() * (canvas.height - clonedBlob.dimensions[1])
  blobs.push(clonedBlob)
  blobCounter(true)
}

type EyePropertyNames = 'eyeImages' | 'eyeImagesClosed' | 'eyeImagesScrunched'

const eyePropertyArrayNames: EyePropertyNames[] = [
  'eyeImages',
  'eyeImagesClosed',
  'eyeImagesScrunched',
]
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
    const eyePropertyArrayName = eyePropertyArrayNames[eye.hitFrame]
    if (eyePropertyArrayName) {
      const eyeImages = blawbImageGroup[eyePropertyArrayName] as HTMLImageElement[]
      const eyeImage = eyeImages[eyeIndex] as HTMLImageElement
      context.drawImage(eyeImage, topLeftX, topLeftY)
    }
    // context.fillStyle = eye.hitFrame ? 'blue' : 'magenta'
    // context.strokeText('' + eyeIndex, topLeftX + eye.pos[0], topLeftY + eye.pos[1])
    // context.fillText('' + eyeIndex, topLeftX + eye.pos[0], topLeftY + eye.pos[1])
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
const loadAudioPromise = function (audio: HTMLAudioElement) {
  audio.volume = 0
  return new Promise<void>((resolve) => {
    audio.addEventListener('ended', () => {
      audio.volume = 1
      resolve()
    })
    audio.play()
  })
}
const imagePromises = images.map(loadImagePromise)
const isEyeGone = (eye: Eye) => eye.hitFrame > 2
const blobHasTime = (blob: Blawb) => {
  const isAlive = blob.spawnTimer > 0
  if (!isAlive) {
    healthCounter -= 100
    sfx.blobDespawn.volume = 0.25
    sfx.blobDespawn.play()
  }
  return isAlive
}
const isBlobAlive = (blob: Blawb) => !blob.eyes.every(isEyeGone) && blobHasTime(blob)
let isRunning = true
let lastTime = 0
let spawnBlobTicker: number
const renderLoop = (time: number): void => {
  if (isRunning) {
    requestAnimationFrame(renderLoop)
  }
  const delta = (lastTime - time) / 1000
  updateHealthText()
  updateScoreText()
  if (healthCounter < health) {
    health -= 1
  }
  if (health <= 0) {
    isRunning = false
    clearInterval(spawnBlobTicker)
    drawEndScreen()
    return
  }
  context.clearRect(0, 0, canvas.width, canvas.height)
  blobs = blobs.filter(isBlobAlive)
  if (blobCount > blobs.length) {
    blobCounter(false)
  }
  blobs.forEach((blob) => {
    // const blobPhase = (phase + blob.phase) * blob.speed
    blob.spawnTimer -= 1
    // console.log(`what is ${blob.name}'s spawn timer?:`, blob.spawnTimer)
    bounce(blob, delta)
  })
  // blobs = blobs.filter(shouldBlobDespawn)
  blobs.forEach(drawBlawb)
  lastTime = time
}
// TODO: Create loading screen once start button is pressed
const startGame = () => {
  // startGameButton.disabled = true
  // startGameButton.innerText = 'loading'
  // cant start loading audio until user has interacted with page
  drawLoadingScreen()
  const audioPromises = Object.values(sfx).map(loadAudioPromise)
  Promise.all([...imagePromises, ...audioPromises]).then(function () {
    // startGameButton.innerText = 'loaded'
    makeRandomBlob()
    spawnBlobTicker = setInterval(makeRandomBlob, 5000)
    requestAnimationFrame(renderLoop)
  })
}

// startGameButton.addEventListener('click', startGame)
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
let wasStarted: boolean = false
const collideMouseClickWithEyes = function (evt: MouseEvent) {
  const pos = getMousePos(canvas, evt)
  const mouseVertex: Vec2 = [pos.x, pos.y]
  if (hitTest(mouseVertex, triangleCenterPos, triangleSize) && !wasStarted) {
    startGame()
    wasStarted = true
    // console.log('Start Button hitTest successful')
  }
  // console.log('what is pos.x and pos.y', pos.x, ',', pos.y)
  blobs.forEach((blob) => {
    blob.eyes.forEach(function (eye) {
      const eyePosition = vertexAdd(blob.topLeftCorner, eye.pos)
      if (eye.hitFrame || !hitTest(mouseVertex, eyePosition, 20)) {
        return
      }
      // console.log('which eye did we click on', eye, eyeIndex);
      score += 5
      if (isBlobAlive(blob)) {
        score += 10
      }
      sfx.squish0.play()
      eye.hitFrame = 1
      setTimeout(() => {
        eye.hitFrame = 2
      }, 100)
      setTimeout(() => {
        eye.hitFrame = 3
      }, 300)
    })
  })
}
canvas.addEventListener('mousedown', collideMouseClickWithEyes)
