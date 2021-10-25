export const make = (generator) => {
  const int = (range, offset = 0) => Math.floor(
    generator.next().value * range
  ) + offset;

  const item = (array) => array[int(array.length)];

  return {
    int,
    item,
  };
};
