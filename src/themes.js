import {
  composable,
  merge,
  replace,
  selectAll
} from "composable-state";

export const base = {
  generated: [
    '❤️',
    '🍔',
    '😂',
    '🏆',
    '🦍',
    '🏠',
    '😀',
    '✈️',
  ],
  special: {
    clearRowOrColumn: '⚡',
    clearNearby: '💣'
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
    '🗝️',
    '🪙',
    '🦜',
    '❤️',
    '💠',
    '💎',
    '⛵',
    '🧭',
    'arrh',
  ]),
  merge({
    clearNearby: '🧨',
  }),
);
