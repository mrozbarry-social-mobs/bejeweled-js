// 1. Range should be between 3 to 5 emoji in a row
// 2. To test columns, we need to rotate the array
// 3. Instead of return true/false, we should return an array of {x, y} objects to tell the game which cells to remove

export const hasAnyMatches = (cells) => {
  for (let y = 0; y < cells.length; y++) {
    const row = cells[y];
    for (let x = 0; x < row.length - 2; x++) {
      const emoji = row[x];

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
