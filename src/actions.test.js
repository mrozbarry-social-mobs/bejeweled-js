import test from 'ava';
import { effects } from 'ferp';
import * as Actions from './actions.js';

test.skip('initial state is consistent', (t) => {
  t.snapshot(Actions.INITIAL_STATE);
});

test.skip('can update screen resolution', (t) => {
  const windowResolution = { x: 2, y: 2 };
  const canvasResolution = { x: 1, y: 1 };

  const [state, fx] = Actions.updateResolution(
    windowResolution,
    canvasResolution,
  )(Actions.INITIAL_STATE);

  t.deepEqual(state.canvas.scale, windowResolution);
  t.deepEqual(state.canvas.rect, {
    x: 1 / 2,
    y: 1 / 2,
    w: 2 / 2,
    h: 2 / 2,
  });
  t.deepEqual(fx, effects.none());
});
