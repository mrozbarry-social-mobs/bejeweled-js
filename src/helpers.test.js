import test from 'ava';
import {hasAnyMatches} from './helpers';

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
