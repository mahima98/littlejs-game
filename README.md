# littlejs-game

Small 2D games made with [LittleJS](https://github.com/KilledByAPixel/LittleJS), React, TypeScript and Vite.

## Getting started

You need [Node.js](https://nodejs.org) (version 22 or newer).

```bash
npm install     # first time only: downloads the libraries
npm run dev     # starts the game
```

Then open the link it prints (usually http://localhost:5173). The page reloads by itself when you save a file.

| Command | What it does |
|---|---|
| `npm run dev` | Run the game locally while you work on it |
| `npm run build` | Check types and build a final version into `dist/` |
| `npm run preview` | Open the built `dist/` version |
| `npm run lint` | Check the code for common mistakes |

## The games

**The Walk** (`src/walk.ts`, the one that shows now): a short animation that plays by itself.
1. A boy walks to the first stop (Haldi) and his clothes turn yellow.
2. He walks on to the girl in red, and his clothes fade to white along the way.
3. They hold hands, a ❤ and the word "happy" appear, and fireworks go off.

**Car game** (`src/game.ts`): move the car with the ← → arrow keys. Click to make explosions, or click the dot to score. It also has fire, smoke, rain and sparks.

To switch which game shows, change the import in `src/App.tsx`:

```ts
import { startGame } from './walk'   // or './game' for the car game
```

## Project files

```
src/
  main.tsx    starts React
  App.tsx     the page: title + the box the game draws into
  walk.ts     The Walk
  game.ts     Car game
  index.css   page styles (Tailwind)
```

## How a LittleJS game works

Each game file calls `L.engineInit(...)` once, passing it a few functions that the engine runs for you:

| Function | When it runs | Used for |
|---|---|---|
| init | once at the start | create things (like particle effects) |
| update | every frame (60 per second) | move things, read keys and the mouse, change the stage |
| render | every frame | draw shapes in the world (`drawRect`, `drawCircle`, `drawLine`, `drawText`) |
| renderPost | every frame, after everything else | draw text that stays fixed on the screen |

Things to know:
- **World units, not pixels.** The canvas is 800×450 pixels and shows about 25×14 world units. `(0, 0)` is the center, and `y` goes **up**.
- **Colors** use `L.rgb(red, green, blue, alpha)`, with values from 0 to 1. Alpha 0 means invisible. You can also use names like `L.RED` and `L.YELLOW`.
- **Effects** (fire, smoke, rain, sparks, fireworks) are `L.ParticleEmitter` objects. The list of settings is at the top of `src/game.ts`.
- `engineInit` may only run once. The `started` check in `startGame` stops React from running it twice.

## Guidelines

- Change one number at a time and watch what it does. That's the fastest way to learn.
- Keep each game in its own file under `src/`, and export a `startGame(root)` function so `App.tsx` can switch between games.
- Run `npm run build` before sharing. It catches type errors that `npm run dev` doesn't show.
