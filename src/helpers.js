export const hasThreeInARow = (cells) => {
  for(let y = 0; y< cells.length; y++) {
    const row = cells[y];
    for(let x = 0; x < row.length; x++) {
      const emoji = row[x];
      const hasThreeEmojisInARow = [1,2].every((length) => row[x+length] == emoji);    

      if(hasThreeEmojisInARow) {
        return true
      }
    }
  }
  return false
}
