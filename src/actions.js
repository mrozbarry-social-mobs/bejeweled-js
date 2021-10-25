import { collect, composable, replace, select, selectAll, setIn } from 'composable-state';
import {effects} from 'ferp';

import * as Random from './random';

function *notRandom(rndValue) {
  while (true) {
    yield rndValue;
  }
}

const jewels = [
  { shape: 'square', color: '#999' },
  { shape: 'circle', color: '#999' },
  { shape: 'triangle', color: '#999' },
  { shape: 'parallelogram', color: '#999' },
];

const jewel = (random) => {
  let foo = random.item(jewels);

  return foo;
};

export const INITIAL_STATE = {
  game: {
    random: Random.make(notRandom(0)),
    gridSize: 0,
    cells: [],
    cursor: {
      position: { x: 0, y: 0 },
      anchor: false
    },
  },
  canvas: {
    scale: { x: 1, y: 1 },
    rect: { x: 0, y: 0, w: 800, h: 600 },
  },
};

export const updateResolution = (windowResolution, canvasResolution) => (state) => {
  const scaleValue = Math.min(
    windowResolution.x / canvasResolution.x,
    windowResolution.y / canvasResolution.y,
  );

  const rect = {
    w: windowResolution.x * scaleValue,
    h: windowResolution.y * scaleValue,
  };

  rect.x = (windowResolution.x - rect.w) / 2;
  rect.y = (windowResolution.y - rect.h) / 2;

  return [
    composable(
      state,
      selectAll({
        'canvas.scale': windowResolution,
        'canvas.rect': rect,
      }),
    ),
    effects.none(),
  ];
};

export const setRandom = (generator) => (state) => {
  return [
    composable(
      state,
      select('game', setIn('random', Random.make(generator))),
    ),
    effects.none(),
  ];
};

export const setLevel = (size) => (state) => {
  return [
    composable(
      state,
      select(
        'game',
        selectAll({
          gridSize: replace(size),
          cells: replace(Array.from({ length: size * size }, () => jewel(state.game.random))),
          cursor: replace({
            interactive: false,
            position: { x: 0, y: 0 },
          }),
        }),
      ),
    ),
    effects.none(),
  ];
};

export const moveCursor = (xMove = 0, yMove = 0) => (state) => {
  function clamp(value) {
    return Math.max(0, Math.min(state.game.gridSize - 1, value))
  }

  // find current position in state
  // calculate next position in state
  // use math to convert x/y to index
  // swap objects in state.game.cells array
  // "commit" the cells to state

  var currentPosition = state.game.cursor.position;
  var nextPosition = { x: clamp(currentPosition.x + xMove), y: clamp(currentPosition.y + yMove) };
  const currentIndex = (currentPosition.y * state.game.gridSize) + currentPosition.x
  const nextIndex = (nextPosition.y * state.game.gridSize) + nextPosition.x;
  const currentValue = state.game.cells[currentIndex];
  const nextValue = state.game.cells[nextIndex];

  return [
    composable(
      state,
      select(
        'game',
        selectAll({
          'cursor.position': replace((position) => ({ x: clamp(position.x + xMove), y: clamp(position.y + yMove) })),
          'cursor.anchor': replace(false),
          'cells': state.game.cursor.anchor ? collect([
            setIn(currentIndex, replace(nextValue)),
            setIn(nextIndex, replace(currentValue)),
          ]) : replace(oldCells => oldCells)
        }),
      )
    ),
    effects.none(),
  ]
};

export const setAnchor = (state) => { 
  return [
    composable(
      state,
      select(
        'game.cursor.anchor',
        replace((oldAnchor) => !oldAnchor)
      )
    ),
    effects.none(),
  ]
}
