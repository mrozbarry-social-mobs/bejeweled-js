import {
  composable,
  merge,
  replace,
  selectAll
} from "composable-state";

export const base = {
  generated: [
    'โค๏ธ',
    '๐',
    '๐',
    '๐',
    '๐ฆ',
    '๐ ',
    '๐',
    'โ๏ธ',
  ],
  special: {
    clearRowOrColumn: 'โก',
    clearNearby: '๐ฃ'
  },
};

export const extend = (generated = replace(base.generated), special = merge({})) => composable(
  base,
  selectAll({
    generated,
    special,
  }),
);

export const pirate = extend(
  replace([
    '๐๏ธ',
    '๐ช',
    '๐ฆ',
    'โค๏ธ',
    '๐ ',
    '๐',
    'โต',
    '๐งญ',
  ]),
  merge({
    clearNearby: '๐งจ',
  }),
);
