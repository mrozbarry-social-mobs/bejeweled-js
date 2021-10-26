/**
 * @jsx c
 * @jsxFactory c
 */
import { render, c } from 'declarativas';
import { app, effects } from 'ferp';
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
  function *mathRandom() {
    while (true) {
      yield Math.random();
    }
  }

  const draw = (state) => render(
    canvasDomElement.getContext('2d'),
    [
      <save />,
      
      <fillStyle value="#fff" />,
      <fillRect x={0} y={0} width={resolution.x} height={resolution.y} />,
      <Board {...state} />,
      <restore />,
    ]
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
      { x: window.innerWidth, y: window.innerHeight },
      resolution,
    ));
  }, 250);

  window.addEventListener('resize', onWindowResize);
  onWindowResize();

  window.addEventListener('keydown', (event) => {
    event.preventDefault()
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
      }

    
  });
};

make(
  document.querySelector('canvas#game'),
  { x: 1024, y: 768 },
);
