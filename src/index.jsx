/**
 * @jsx c
 * @jsxFactory c
 */
import {render, c} from 'declarativas';
import {app, effects} from 'ferp';
import * as Actions from './actions';

import Board from './components/board.jsx';

const debounce = (fn, ms) => {
  let handle = null;
  return (...args) => {
    clearTimeout(handle);
    handle = setTimeout(() => {
      fn(...args);
    }, ms);
  };
};

const make = (canvasDomElement, resolution) => {
  function* mathRandom() {
    while (true) {
      yield Math.random();
    }
  }

  const ClearScreen = ({color = '#fff'}) => [
    <fillStyle value={color} />,
    <fillRect x={0} y={0} width={canvasDomElement.width} height={canvasDomElement.height} />,
  ];

  const draw = (state) => render(
    canvasDomElement.getContext('2d'),
    <g>
      <save />
      <ClearScreen />
      <translate x={state.canvas.rect.x} y={state.canvas.rect.y} />
      <scale x={state.canvas.scale.w} y={state.canvas.scale.h} />
      <Board {...state} />
      <restore />
    </g>
  );

  const dispatch = app({
    init: [
      Actions.INITIAL_STATE,
      effects.batch([
        effects.act(Actions.setRandom(mathRandom())),
        effects.act(Actions.setLevel(8)),
      ]),
    ],
    observe: ([state]) => {
      draw(state);
    },
  });

  const onWindowResize = debounce(() => {
    canvasDomElement.width = window.innerWidth;
    canvasDomElement.height = window.innerHeight;

    dispatch(Actions.updateResolution(
      {x: window.innerWidth, y: window.innerHeight},
      resolution,
    ));
  }, 250);

  window.addEventListener('resize', onWindowResize);
  onWindowResize();

  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
        return dispatch(Actions.moveCursor(0, -1));

      case 'ArrowDown':
        return dispatch(Actions.moveCursor(0, 1));

      case 'ArrowLeft':
        return dispatch(Actions.moveCursor(-1, 0));

      case 'ArrowRight':
        return dispatch(Actions.moveCursor(1, 0));

      case 'Enter':
        return dispatch(Actions.setAnchor);

      case 'm':
        return dispatch(Actions.audioToggleMusic);

      case 'u':
        return dispatch(Actions.undoMove);

      case 'z':
        if (event.ctrlKey || event.metaKey) {
          return dispatch(Actions.undoMove)
        }
        return;
    }


  });
};

make(
  document.querySelector('canvas#game'),
  {x: 1024, y: 768},
);
