/**
 * @jsx c
 * @jsxFactory c
 */
import { c } from 'declarativas';

export const AudioControl = ({ playing, x })  => (
  <g>
    <save />
    <font value="24px sans-serif" />
    <textAlign value="right" />
    <textBaseline value="bottom" />
    <fillStyle value="red" />
    <fillText text={playing ? '🔈' : '🔇'} x={x} y={0} />
    <restore />
  </g>
);
