import test from 'ava';
import { makeRowAtChecker, makeColAtChecker,  swapCheck } from './swapCheck';

test('search for swaps on row', (t) => {
  const cells = [
    [1, 2, 3, 4],
    [2, 3, 4, 1],
    [3, 4, 3, 2],
    [4, 1, 2, 3],
  ];

  // Top left
  t.falsy(makeRowAtChecker({ x: 0, y: 0 })(cells));

  // Too far right
  t.falsy(makeRowAtChecker({ x: 3, y: 0 })(cells));

  // Could swap the middle 4 with the 3 above
  t.truthy(makeRowAtChecker({ x: 0, y: 2 })(cells));
});

test('search for swaps on col', (t) => {
  const cells = [
    [1, 2, 3, 4],
    [2, 3, 4, 1],
    [3, 4, 3, 2],
    [4, 1, 2, 3],
  ];

  // Second Row
  t.truthy(makeColAtChecker({ x: 2, y: 0 })(cells));

  t.falsy(makeColAtChecker({ x: 0, y: 0 })(cells));
  t.falsy(makeColAtChecker({ x: 0, y: 3 })(cells));
});

test('swapCheck can detect row', (t) => {
  const cells = [
    [1, 2, 5, 4],
    [2, 3, 4, 1],
    [3, 4, 3, 2],
    [4, 1, 2, 3],
  ];

  t.truthy(swapCheck(cells));
});

test('swapCheck can detect col', (t) => {
  const cells = [
    [3, 2, 5, 4],
    [2, 3, 4, 1],
    [3, 4, 9, 2],
    [4, 1, 2, 3],
  ];

  t.truthy(swapCheck(cells));
});
