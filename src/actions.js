import { collect, composable, replace, select, selectAll, setIn } from 'composable-state';
import { effects } from 'ferp';

import * as Themes from './themes';
import * as Random from './random';
import { hasAnyMatches } from './helpers';

function* notRandom(rndValue) {
  while (true) {
    yield rndValue;
  }
}

export const INITIAL_STATE = {
  game: {
    random: Random.make(notRandom(0)),
    theme: Themes.base,
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
            interactive: false,
            position: { x: 0, y: 0 },
          }),
        }),
      ),
    ),
    effects.act(removeMatches),
  ];
};

export const removeMatches = (state) => {
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
      : effects.none()
  ]
};

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
          if (y > 0) {
            newCells[y][x] = newCells[y - 1][x]
            newCells[y - 1][x] = '';
          } else {
            newCells[y][x] = state.game.random.item(state.game.theme.generated);
          }
          return newCells;
        }, oldCells))
      ),
    ),
    nextPositions.length
      ? effects.defer((done) => setTimeout(() => done(effects.act(applyGravity(nextPositions))), 250))
      : effects.act(removeMatches)
  ];
};

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
          'cursor.position': replace((position) => ({ x: clamp(position.x + xMove), y: clamp(position.y + yMove) })),
          'cursor.anchor': replace(false),
          'cells': state.game.cursor.anchor ? collect([
            select(`${currentPosition.y}.${currentPosition.x}`, replace(nextValue)),
            select(`${nextPosition.y}.${nextPosition.x}`, replace(currentValue)),
          ]) : replace(oldCells => oldCells)
        }),
      )
    ),
    effects.act(removeMatches),
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
