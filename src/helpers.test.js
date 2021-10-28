import test from 'ava';
import {hasAnyMatches} from './helpers';

test('Can detect 3 in a row', (t) => {
  const cells = [
    [0, 1, 1, 1],
  ];

  t.deepEqual(hasAnyMatches(cells), [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ])
});

test('Can detect 4 in a row', (t) => {
  const cells = [
    [1, 1, 1, 1],
  ];

  t.deepEqual(hasAnyMatches(cells), [])
});

test('Can detect 5 in a row', (t) => {
  const cells = [
    [1, 1, 1, 1, 1],
  ];

  t.deepEqual(hasAnyMatches(cells), [])
});
