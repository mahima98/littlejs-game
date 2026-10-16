import * as L from 'littlejsengine'

// A boy walks to the dressing room (turns yellow), then walks to the girl
// (his clothes fade to white on the way), then they hold hands.
const GROUND = -3
const SHOP_X = -3, SHOP_Y = 8, GIRL_X = 9, MEET_X = 7.8 // boy stops just left of the girl
const SPEED = 0.05 // world units per frame
const SKIN = L.rgb(1, 0.85, 0.7), DARK = L.rgb(0.2, 0.2, 0.3)

let boyX = -10, clothes = L.BLUE, waitFrames = 0, started = false
let stage = 'toShop' // toShop -> dressing -> toGirl -> together

function update() {
  if (stage === 'toShop') {
    boyX += SPEED
    if (boyX >= SHOP_X) stage = 'dressing'
  } else if (stage === 'dressing') {
    clothes = L.YELLOW
    if (++waitFrames > 90) stage = 'toGirl' // stand still ~1.5 seconds while dressing
  } else if (stage === 'toGirl') {
    boyX = Math.min(boyX + SPEED, MEET_X)
    clothes = L.YELLOW.lerp(L.WHITE, L.percent(boyX, SHOP_X, MEET_X)) // 0% = yellow, 100% = white
    if (boyX === MEET_X) stage = 'together'
  } else if (stage === 'together') {
    if (L.rand() < 0.03) firework() // about 2 fireworks per second while "happy" shows
  }
}

// One burst of colored sparks at a random spot in the sky, falling slowly with gravity
function firework() {
  const color = L.hsl(L.rand(), 1, 0.6)
  new L.ParticleEmitter(L.vec2(L.rand(-10, 10), L.rand(2, 6)), 0, 0.2, 0.1, 600, L.PI, undefined,
    color, L.WHITE, color.scale(1, 0), color.scale(1, 0),
    1.2, 0.2, 0.05, 0.15, 0, 0.95, 1, 0.3, L.PI, 0.1, 0.3, false, true)
}

// Draws a person standing on the ground at x. handTo = x position where one hand reaches to hold hands.
function drawPerson(x: number, color: L.Color, walking: boolean, isGirl: boolean, handTo?: number) {
  const swing = walking ? Math.sin(L.time * 10) * 0.3 : 0 // legs swing back and forth while walking
  const hip = L.vec2(x, GROUND + 1), shoulder = L.vec2(x, GROUND + 2)
  L.drawLine(hip, L.vec2(x + swing, GROUND), 0.15, DARK) // legs
  L.drawLine(hip, L.vec2(x - swing, GROUND), 0.15, DARK)
  L.drawRect(L.vec2(x, GROUND + 1.5), L.vec2(isGirl ? 1.1 : 0.7, 1.1), color) // dress or shirt
  // side -1 = left arm, 1 = right arm; the arm facing handTo reaches out to it
  const hand = (side: number) => handTo !== undefined && Math.sign(handTo - x) === side
    ? L.vec2(handTo, GROUND + 1.3)
    : L.vec2(x + side * 0.35, GROUND + 1.1)
  L.drawLine(shoulder, hand(-1), 0.12, SKIN)
  L.drawLine(shoulder, hand(1), 0.12, SKIN)
  L.drawCircle(L.vec2(x, GROUND + 2.6), 0.8, SKIN) // head
}

function render() {
  L.drawRect(L.vec2(0, 5), L.vec2(100, 16), L.rgb(0.5, 0.8, 1)) // sky
  L.drawRect(L.vec2(0, GROUND - 5), L.vec2(100, 10), L.rgb(0.3, 0.7, 0.3)) // grass
  // destination 1: the dressing room
  L.drawRect(L.vec2(SHOP_X, GROUND + 1.5), L.vec2(3, 3), L.WHITE)
  if (boyX >= SHOP_X)
  L.drawText('Haldi', L.vec2(SHOP_X, GROUND + 3.6), 0.6, L.BLACK)
  // destination 2: the girl waiting in red
  L.drawRect(L.vec2(SHOP_Y, GROUND + 1.5), L.vec2(5, 3), L.YELLOW)
  const together = stage === 'together'
  const hands = together ? (MEET_X + GIRL_X) / 2 : undefined // they meet in the middle
  drawPerson(GIRL_X, L.RED, false, true, hands)
  drawPerson(boyX, clothes, stage === 'toShop' || stage === 'toGirl', false, hands)
  
  if (together) L.drawText('❤', L.vec2(hands!, GROUND + 3.8), 1, L.RED), L.drawText('happy', L.vec2(10, 2), 0.6, L.BLACK)
}

export function startGame(root: HTMLElement) {
  if (started) return // engineInit may only run once (React StrictMode mounts twice)
  started = true
  L.setShowSplashScreen(false)
  L.setGravity(L.vec2(0, -0.01)) // makes firework sparks fall
  L.setCanvasFixedSize(L.vec2(800, 450))
  L.engineInit(() => {}, update, () => {}, render, () => {}, [], root)
}
