// 2. second distinct hasMatches method
//  - hasAnyMatches
//    - hasAnyRowMatches
//    - HasAnyColumnMatches
export const hasAnyMatches = (cells) => {
  return hasAnyColumnMatches(cells).concat(hasAnyRowMatches(cells));
}

export const hasAnyColumnMatches = (cells) => {
  for (let x = 0; x < cells.length; x++) {
    const column = Array.from({ length: cells.length }, (_, y) => cells[y][x]);
    for (let y = 0; y < column.length - 2; y++) {
      const emoji = column[y];
      if (emoji === '') continue;

      let length = 1;
      let following = column[y + length];
      while (following === emoji) {
        length++;
        following = column[y + length];
      }
      if (length < 3) continue;

      return Array.from({ length }, (_, iteration) => ({
        x,
        y: iteration + y,
      }));
    }
  }
  return [];
}

export const hasAnyRowMatches = (cells) => {
  for (let y = 0; y < cells.length; y++) {
    const row = cells[y];
    for (let x = 0; x < row.length - 2; x++) {
      const emoji = row[x];
      if (emoji === '') continue;

      let length = 1;
      let following = row[x + length];
      while (following === emoji) {
        length++;
        following = row[x + length];
      }
      if (length < 3) continue;


      return Array.from({ length }, (_, iteration) => ({
        x: iteration + x,
        y,
      }));
    }
  }
  return [];
}

const walk = (cells, value, position, direction, hasSwapped = false, count = 0) => {
  if (count === 3) {
    return true;
  }
  const p = {
    x: position.x + direction.x,
    y: position.y + direction.y,
  };
  const currentValue = cells[p.y]
    ? (cells[p.y][p.x] || '')
    : '';
  if (value !== currentValue) {
    // TODO: finish this
    // if we haven't swapped, is there a swappable in the inverse direction
    return false;
  }
  return walk(
    cells,
    value,
    p,
    direction,
    hasSwapped,
    count + 1,
  )

}

export const hasAnyPotentialMoves = (cells) => {
  for(let y = 0; y < cells.length; y++) {
    const row = cells[y];
    for(let x = 0; x < row.length; x++) {
      const col = row[x];
      const result = walk(cells, col, { x, y }, { x: 0, y: 1 }, false, 0)
        || walk(cells, col, { x, y }, { x: 1, y: 0 }, false, 0);

      if (result) {
        return true;
      }
    }
  }
  return false;
};
