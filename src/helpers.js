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

      const hasFiveEmojisInARow = [1, 2, 3, 4].every((length) => column[y + length] == emoji);
      if (hasFiveEmojisInARow) {
        return [0, 1, 2, 3, 4].map((offset) => ({
          x,
          y: y + offset,
        }));
      }

      const hasFourEmojisInARow = [1, 2, 3].every((length) => column[y + length] == emoji);
      if (hasFourEmojisInARow) {
        return [0, 1, 2, 3].map((offset) => ({
          x,
          y: y + offset,
        }));
      }

      const hasThreeEmojisInARow = [1, 2].every((length) => column[y + length] == emoji);
      if (hasThreeEmojisInARow) {
        return [0, 1, 2].map((offset) => ({
          x,
          y: y + offset,
        }));
      }
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

      const hasFiveEmojisInARow = [1, 2, 3, 4].every((length) => row[x + length] == emoji);
      if (hasFiveEmojisInARow) {
        return [0, 1, 2, 3, 4].map((offset) => ({
          x: x + offset,
          y,
        }));
      }

      const hasFourEmojisInARow = [1, 2, 3].every((length) => row[x + length] == emoji);
      if (hasFourEmojisInARow) {
        return [0, 1, 2, 3].map((offset) => ({
          x: x + offset,
          y,
        }));
      }

      const hasThreeEmojisInARow = [1, 2].every((length) => row[x + length] == emoji);
      if (hasThreeEmojisInARow) {
        return [0, 1, 2].map((offset) => ({
          x: x + offset,
          y,
        }));
      }
    }
  }
  return [];
}
