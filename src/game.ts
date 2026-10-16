import * as L from 'littlejsengine'

// Click the dot: each hit scores a point and moves the dot.
let pos = L.vec2(), score = 0, started = false
const R = 1 // dot radius in world units
let carX = 0
const CAR_Y = -6, CAR_RANGE = 4 // car drives left/right within ±CAR_RANGE
const FIRE = L.vec2(9, -6)
let sparks: L.ParticleEmitter

// ParticleEmitter args: pos, angle (0 = up), emitSize, emitTime (0 = forever), emitRate, emitCone, tile,
// colorStartA, colorStartB, colorEndA, colorEndB, life, sizeStart, sizeEnd, speed, angleSpeed,
// damping, angleDamping, gravityScale, particleCone, fadeRate, randomness, collideLevel, additive
function makeEffects() {
  L.setGravity(L.vec2(0, -0.01)) // only particles use gravity
  // fire
  new L.ParticleEmitter(FIRE, 0, 1, 0, 60, 0.4, undefined,
    L.rgb(1, 0.8, 0), L.rgb(1, 0.3, 0), L.rgb(1, 0, 0, 0), L.rgb(0.5, 0, 0, 0),
    0.6, 0.7, 0.1, 0.04, 0.05, 0.98, 1, 0, L.PI, 0.3, 0.5, false, true)
  // smoke rising from the fire
  new L.ParticleEmitter(FIRE.add(L.vec2(0, 1)), 0, 1, 0, 15, 0.3, undefined,
    L.rgb(0.4, 0.4, 0.4, 0.6), L.rgb(0.2, 0.2, 0.2, 0.6), L.rgb(0.3, 0.3, 0.3, 0), L.rgb(0.1, 0.1, 0.1, 0),
    3, 0.5, 3, 0.03, 0.02, 0.99, 1, 0, L.PI, 0.5, 0.5)
  // rain across the whole screen
  new L.ParticleEmitter(L.vec2(0, 8), L.PI, L.vec2(30, 0), 0, 200, 0, undefined,
    L.rgb(0.6, 0.7, 1, 0.7), L.rgb(0.8, 0.9, 1, 0.7), L.rgb(0.6, 0.7, 1, 0.3), L.rgb(0.8, 0.9, 1, 0.3),
    1, 0.12, 0.12, 0.3, 0, 1, 1, 0, 0, 0.1, 0.2)
  // sparks under the car, turned on while it drives
  sparks = new L.ParticleEmitter(L.vec2(), 0, 0.5, 0, 0, 0.8, undefined,
    L.rgb(1, 1, 0.5), L.rgb(1, 0.6, 0), L.rgb(1, 0.3, 0, 0), L.rgb(1, 0, 0, 0),
    0.4, 0.15, 0.05, 0.15, 0, 1, 1, 1, L.PI, 0.1, 0.5, false, true)
}

function explode(at: L.Vector2) {
  new L.ParticleEmitter(at, 0, 1, 0.15, 400, L.PI, undefined,
    L.rgb(1, 1, 0.6), L.rgb(1, 0.5, 0), L.rgb(0.6, 0.1, 0, 0), L.rgb(0.2, 0.2, 0.2, 0),
    0.8, 0.6, 2, 0.25, 0.1, 0.9, 1, 0, L.PI, 0.3, 0.6, false, true)
}

export function startGame(root: HTMLElement) {
  if (started) return // engineInit may only run once (React StrictMode mounts twice)
  started = true
  L.setShowSplashScreen(false)
  L.setCanvasFixedSize(L.vec2(800, 450))
  L.engineInit(
    makeEffects,
    () => {
      if (L.mouseWasPressed(0)) explode(L.mousePos) // click anywhere to explode
      if (L.mouseWasPressed(0) && L.mousePos.distance(pos) < R) {
        score++
        pos = L.vec2(L.rand(-10, 10), L.rand(-5, 5))
      }
      const dir = L.keyDirection().x
      carX = L.clamp(carX + dir * 0.2, -CAR_RANGE, CAR_RANGE)
      sparks.pos = L.vec2(carX - dir * 1.2, CAR_Y - 1)
      sparks.angle = -dir * 1 // spray backwards and up
      sparks.emitRate = dir && Math.abs(carX) < CAR_RANGE ? 100 : 0
    },
    () => {},
    () => {
      L.drawRect(L.vec2(), L.vec2(100), L.hsl(0.6, 0.4, 0.15))
      L.drawCircle(pos, R * 2, L.hsl(score / 10, 1, 0.5))
      L.drawRect(L.vec2(0, CAR_Y - 0.8), L.vec2(CAR_RANGE * 2 + 3, 0.2), L.GRAY) // track
      L.drawRect(L.vec2(carX, CAR_Y), L.vec2(3, 1), L.RED) // body
      L.drawRect(L.vec2(carX, CAR_Y + 0.7), L.vec2(1.6, 0.6), L.RED) // cabin
      L.drawCircle(L.vec2(carX - 0.9, CAR_Y - 0.5), 0.7, L.BLACK)
      L.drawCircle(L.vec2(carX + 0.9, CAR_Y - 0.5), 0.7, L.BLACK)
    },
    () => L.drawTextScreen(`Score: ${score}`, L.vec2(400, 40), 40),
    [],
    root,
  )
}
