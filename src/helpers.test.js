import test from 'ava';
import {hasAnyMatches,hasAnyPotentialMoves} from './helpers';

test('Can detect 3 in a row', (t) => {
  const cells = [
    [0, 3, 3, 3],
  ];

  t.deepEqual(hasAnyMatches(cells), [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ])
});

test('Can detect 4 in a row', (t) => {
  const cells = [
    [0, 3, 0, 0],
    [1, 1, 1, 1],
  ];

  t.deepEqual(hasAnyMatches(cells), [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
  ])
});

test('Can detect 5 in a row', (t) => {
  const cells = [
    [0, 0, 1, 1, 1, 1, 1],
  ];

  t.deepEqual(hasAnyMatches(cells), [
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 6, y: 0 },
  ])
});

test('Can detect 3 in a column', (t) => {
  const cells = [
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 1],
  ];

  t.deepEqual(hasAnyMatches(cells), [
    { x: 0, y: 0},
    { x: 0, y: 1},
    { x: 0, y: 2},
  ])
});

test('Can detect 4 in a column', (t) => {
  const cells = [
    [1, 0, 2, 4],
    [2, 0, 3, 3],
    [3, 0, 1, 4],
    [4, 0, 3, 1],
  ];

  t.deepEqual(hasAnyMatches(cells), [
    { x: 1, y: 0},
    { x: 1, y: 1},
    { x: 1, y: 2},
    { x: 1, y: 3},
  ])
});

test('Can detect 5 in a column', (t) => {
  const cells = [
    [1, 1, 0, 2, 4],
    [2, 2, 0, 3, 3],
    [3, 3, 0, 1, 4],
    [4, 4, 0, 3, 1],
    [4, 4, 0, 3, 1],
  ];

  t.deepEqual(hasAnyMatches(cells), [
    { x: 2, y: 0},
    { x: 2, y: 1},
    { x: 2, y: 2},
    { x: 2, y: 3},
    { x: 2, y: 4},
  ])
});

test('does not explode if the value of the cell with 3+ in a row or column is empty', (t) => {
  const cells = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]; 

  t.deepEqual(hasAnyMatches(cells), []);
});

test('that it returns true if it has potential moves', (t) => {
  const cells = [
    [1, 1, 0, 2, 4],
    [2, 2, 0, 3, 3],
    [3, 3, 1, 0, 4],
    [4, 4, 0, 3, 1],
    [4, 4, 0, 3, 1],
  ];
  t.truthy(hasAnyPotentialMoves(cells));
});

test('returns false if no valid moves', (t) => {
  const cells = [
    [1, 1, 0, 2, 4],
    [2, 2, 0, 3, 3],
    [3, 3, 1, 2, 4],
    [4, 4, 2, 3, 1],
    [4, 4, 0, 3, 1],
  ];
  t.falsy(hasAnyPotentialMoves(cells));
});
