import { collect composable, replace, select, selectAll, setIn } from 'composable-state';
import { effects } from 'ferp';

import * as Themes from './themes';
import * as Random from './random';
import { hasAnyMatches } from './helpers';
import { swapCheck } from './lib/swapCheck';

function* notRandom(rndValue) {
  while (true) {
    yield rndValue;
  }
}

export const INITIAL_STATE = {
  game: {
    random: Random.make(notRandom(0)),
    theme: Themes.pirate,
    gridSize: 0,
    cells: [],
    cursor: {
      position: { x: 0, y: 0 },
      anchor: false
    },
    remainingSwaps: 1,
  },
  canvas: {
    scale: { x: 1, y: 1 },
    rect: { x: 0, y: 0, w: 800, h: 600 },
  },
};

export const updateResolution = (windowResolution, canvasResolution) => (state) => {
  const scaleValue = Math.min(
    canvasResolution.x / windowResolution.x,
    canvasResolution.y / windowResolution.y,
  );

  const rect = {
    w: Math.floor(windowResolution.x * scaleValue),
    h: Math.floor(windowResolution.y * scaleValue),
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
          cells: replace(Array.from({ length: size }, () => Array.from({ length: size }, () => state.game.random.item(state.game.theme.generated)))),
          cursor: replace({
            anchor: false,
            position: { x: 0, y: 0 },
          }),
        }),
      ),
    ),
    effects.act(removeMatches()),
  ];
};

export const regenerateBoard = (state) => {
  const size = state.game.gridSize;
  return [
    composable(
      state,
      select(
        'game',
        selectAll({
          cells: replace(Array.from({ length: size }, () => Array.from({ length: size }, () => state.game.random.item(state.game.theme.generated)))),
        }),
      ),
    ),
    effects.act(removeMatches),
  ];
};

export const validateBoard = (state) => {
  const isValid = swapCheck(state.game.cells);

  return [
    state,
    isValid
      ? effects.none()
      : effects.act(regenerateBoard)
  ];
};


export const detectUnplayableBoard = (state) => {
  // console.log('Unplayable check', Date.now(), anyMoves);
  return [
    state,
    effects.none(),
  ];
};

export const removeMatches = (revertAction) => (state) => {
  const matches = hasAnyMatches(state.game.cells);

  return [
    composable(
      state,
      select(
        'game.cells',
        replace((oldCells) => matches.reduce((newCells, { x, y }) => {
          newCells[y][x] = '';
          return newCells;
        }, oldCells)),
      ),
    ),
    matches.length
      ? effects.act(applyGravity(matches))
      : (revertAction ? delay(revertAction) : effects.act(detectUnplayableBoard))
  ]
};

export const delay = (action, ms = 250) => {
  return effects.defer((done) => setTimeout(() => done(effects.act(action)), ms))
}

export const applyGravity = (positions = []) => (state) => {
  const nextPositions = positions
    .map(p => ({ ...p, y: p.y - 1 }))
    .filter(p => p.y >= 0);

  return [
    composable(
      state,
      select(
        'game.cells',
        replace((oldCells) => positions.reduce((newCells, { x, y }) => {
          if (y > 0 && newCells[y - 1][x] !== '') {
            newCells[y][x] = newCells[y - 1][x]
            newCells[y - 1][x] = '';
          } else if (y === 0) {
            newCells[y][x] = state.game.random.item(state.game.theme.generated);
          }
          return newCells;
        }, oldCells))
      ),
    ),
    nextPositions.length
      ? delay(applyGravity(nextPositions))
      : effects.act(removeMatches())
  ];
};

export const resetState = (oldState) => () => [
  oldState,
  effects.none(),
];

export const moveCursor = (xMove = 0, yMove = 0) => (state) => {
  function clamp(value) {
    return Math.max(0, Math.min(state.game.gridSize - 1, value))
  }

  const currentPosition = state.game.cursor.position;
  const nextPosition = { x: clamp(currentPosition.x + xMove), y: clamp(currentPosition.y + yMove) };
  const currentValue = state.game.cells[currentPosition.y][currentPosition.x];
  const nextValue = state.game.cells[nextPosition.y][nextPosition.x];


  return [
    composable(
      state,
      select(
        'game',
        selectAll({
          'remainingSwaps': replace(remainingSwaps => (state.game.cursor.anchor ? remainingSwaps - 1 : remainingSwaps)),
          'cursor.position': replace((position) => ({ x: clamp(position.x + xMove), y: clamp(position.y + yMove) })),
          'cursor.anchor': replace(false),
          'cells': state.game.cursor.anchor ? collect([
            select(`${currentPosition.y}.${currentPosition.x}`, replace(nextValue)),
            select(`${nextPosition.y}.${nextPosition.x}`, replace(currentValue)),
          ]) : replace(oldCells => oldCells)
        }),
      )
    ),
    state.game.cursor.anchor
      ? effects.act(removeMatches(resetState(state)))
      : effects.none()
  ];
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
