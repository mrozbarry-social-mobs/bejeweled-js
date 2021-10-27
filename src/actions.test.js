import test from 'ava';
import * as Actions from './actions.js';

test('initial state is consistent', (t) => {
  t.snapshot(Actions.INITIAL_STATE);
});
