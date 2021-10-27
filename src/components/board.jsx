/**
 * @jsx c
 * @jsxFactory c
 */
import { c } from 'declarativas';

const CellOutline = ({x, y, size, shouldHighlight, isAnchored}, children) => [ 
  <strokeStyle value="#a01" />,
  <fillStyle value={isAnchored ? "#eae" : "#fbf"} />,

  shouldHighlight && <fillRect x={x} y={y} width={size} height={size} />,

  children,
];
const boxSize = 50;

const Jewel = ({ x, y, size, character }) => [
  <save />,
  <translate x={(boxSize) / 2} y={(boxSize) / 2} />,
  <font value={`${size}px sans-serif`} />,
  <textAlign value="center" />,
  <textBaseline value="middle" />,
  <strokeStyle value="black" />,
  <strokeText x={x} y={y} text={character} />,
  <restore />
];

export default (state) => state.game.cells.map((row, y) => {
  return row.map((cell, x) => {
    const { position: cursor } = state.game.cursor;
    const isCurrentCellHighlighted = cursor.x === x && cursor.y === y;

    return (
      <CellOutline x={x * boxSize} y={y * boxSize} size={boxSize} shouldHighlight={isCurrentCellHighlighted} isAnchored={state.game.cursor.anchor}>

        <Jewel x={x * boxSize} y={y * boxSize} size={boxSize / 1.4} character={cell} />
        
      </CellOutline>
    );
  });
});
