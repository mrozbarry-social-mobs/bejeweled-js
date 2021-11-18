import {collect composable, replace, select, selectAll, setIn} from 'composable-state';
import {effects} from 'ferp';
import {delay,playBackground} from './effects.js';

import * as Themes from './themes';
import * as Random from './random';
import {hasAnyMatches} from './helpers';
import {swapCheck} from './lib/swapCheck';

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
      position: {x: 0, y: 0},
      anchor: false
    },
    remainingSwaps: 50,
  },
  canvas: {
    scale: {x: 1, y: 1},
    rect: {x: 0, y: 0, w: 800, h: 600},
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
          cells: replace(Array.from({length: size}, () => Array.from({length: size}, () => state.game.random.item(state.game.theme.generated)))),
          cursor: replace({
            anchor: false,
            position: {x: 0, y: 0},
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
          cells: replace(Array.from({length: size}, () => Array.from({length: size}, () => state.game.random.item(state.game.theme.generated)))),
        }),
      ),
    ),
    effects.act(removeMatches()),
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


export const removeMatches = (revertAction) => (state) => {
  const matches = hasAnyMatches(state.game.cells);

  return [
    composable(
      state,
      select(
        'game.cells',
        replace((oldCells) => matches.reduce((newCells, {x, y}) => {
          newCells[y][x] = '';
          return newCells;
        }, JSON.parse(JSON.stringify(oldCells)))),
      ),
    ),
    matches.length
      ? delay(applyGravity)
      : (revertAction ? delay(revertAction) : effects.act(validateBoard))
  ]
};

export const applyGravity = (state) => {
  const emptyCells = state.game.cells.reduce((empties, row, y) => {
    for(let x = 0; x < row.length; x++) {
      if (row[x]) continue;
      empties.push({ x, y });
    }
    return empties;
  }, []);

  if (emptyCells.length === 0) {
    return [state, effects.act(removeMatches())];
  }

  const columnEnds = emptyCells
    .reduce((ends, emptyCell) => {
      const old = ends[emptyCell.x];
      if (old === undefined || emptyCell.y < old) {
        ends[emptyCell.x] = emptyCell.y;
      }
      return ends;
    }, {});

  const columnBottoms = Object.keys(columnEnds).map(x => ({ x, y: columnEnds[x] }));

  return [
    composable(
      state,
      select(
        'game.cells',
        replace((oldCells) => {
          return columnBottoms.reduce((newCells, columnBottom) => {
            if (columnBottom.y > 0) {
              newCells[columnBottom.y][columnBottom.x] = oldCells[columnBottom.y - 1][columnBottom.x];
              newCells[columnBottom.y - 1][columnBottom.x] = '';
            } else {
              newCells[0][columnBottom.x] = state.game.random.item(state.game.theme.generated);
            }
            return newCells;
          }, JSON.parse(JSON.stringify(oldCells)));
        }),
      ),
    ),
    delay(applyGravity, 200),
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
  const nextPosition = {x: clamp(currentPosition.x + xMove), y: clamp(currentPosition.y + yMove)};
  const currentValue = state.game.cells[currentPosition.y][currentPosition.x];
  const nextValue = state.game.cells[nextPosition.y][nextPosition.x];


  return [
    composable(
      state,
      select(
        'game',
        selectAll({
          'remainingSwaps': replace(remainingSwaps => (state.game.cursor.anchor ? remainingSwaps - 1 : remainingSwaps)),
          'cursor.position': replace((position) => ({x: clamp(position.x + xMove), y: clamp(position.y + yMove)})),
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
