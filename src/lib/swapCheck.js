const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });

const read = (position, cells) => {
  const row = cells[position.y];
  if (!row) return undefined;
  return row[position.x];
};

const makeChecker = (positions, initialSwapFromPositionIndex, swapTo) => (cells) => {
  if (!positions[initialSwapFromPositionIndex]) return false;

  const anyBadPositions = [
    ...positions,
    swapTo,
  ].some(p => read(p, cells) === undefined);

  if (anyBadPositions) return false;

  const swapValue = read(swapTo, cells);
  const values = positions.map(p => read(p, cells));
  values[initialSwapFromPositionIndex] = swapValue;

  return values.every(cell => cell === swapValue);
};

const rowCheckers = [
  [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
  ],
  [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
  ],
  [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ],
];

const colCheckers = [
  [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ],
  [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ],
  [
    { x: 0, y: 1 },
    { x: -1, y: -0 },
    { x: 1, y: -0 },
  ],
];
export const makeRowAtChecker = (initialPosition) => {
  const positions = [0, 1, 2].map(offset => ({
    ...initialPosition,
    x: initialPosition.x + offset,
  }));

  const checkers = rowCheckers
    .map((group, index) => {
      const swapTos = group.map(p => add(p, positions[index]));
      return (cells) => swapTos.some(swapTo => makeChecker(positions, index, swapTo)(cells));
    })

  return (cells) => checkers.some(c => c(cells));
};

export const makeColAtChecker = (initialPosition) => {
  const positions = [0, 1, 2].map(offset => ({
    ...initialPosition,
    y: initialPosition.y + offset,
  }));

  const checkers = colCheckers
    .map((group, index) => {
      const swapTos = group.map(p => add(p, positions[index]));
      return (cells) => swapTos.some(swapTo => makeChecker(positions, index, swapTo)(cells));
    })

  return (cells) => checkers.some(c => c(cells));
}

export const swapCheck = (cells) => {
  for(let y = 0; y < cells.length; y++) {
    const row = cells[y];
    for(let x = 0; x < row.length; x++) {
      const position = { x, y };
      const rowChecker = makeRowAtChecker(position);
      if (rowChecker(cells)) {
        return true;
      }
      const colChecker = makeColAtChecker(position);
      if (colChecker(cells)) {
        return true;
      }
    }
  }
  return false;
};
