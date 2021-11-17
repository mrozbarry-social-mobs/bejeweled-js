// 2. second distinct hasMatches method
//  - hasAnyMatches
//    - hasAnyRowMatches
//    - HasAnyColumnMatches
export const hasAnyMatches = (cells) => {
  return hasAnyColumnMatches(cells).concat(hasAnyRowMatches(cells));
}

export const hasAnyColumnMatches = (cells) => {
  let matches = [];

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

      matches = matches.concat(Array.from({ length }, (_, iteration) => ({
        x,
        y: iteration + y,
      })));
    }
  }
  return matches;
}

export const hasAnyRowMatches = (cells) => {
  let matches = [];

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


      matches = matches.concat(Array.from({ length }, (_, iteration) => ({
        x: iteration + x,
        y,
      })));
    }
  }
  return matches;
}
