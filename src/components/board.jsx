/**
 * @jsx c
 * @jsxFactory c
 */
import { c } from 'declarativas';

const CellOutline = ({x, y, size, shouldHighlight, isAnchored}, children) => [ 
  <strokeStyle value="#a01" />,
  <fillStyle value={isAnchored ? "#eae" : "#fbf"} />,

  <strokeRect x={x} y={y} width={size} height={size} />,
  shouldHighlight && <fillRect x={x} y={y} width={size} height={size} />,

  children,
];
const boxSize = 50;

const Square = ({x, y, size}) => [
  <save />,
  <translate x={(boxSize - size) / 2} y={(boxSize - size) / 2} />,
  <strokeStyle value="#f0f" />,
  <beginPath />,
  <moveTo x={x} y={y} />,
  <lineTo x={x+size} y={y} />,
  <lineTo x={x+size} y={y+size} />,
  <lineTo x={x} y={y+size} />,
  <closePath />,
  <stroke />,
  <restore />,
];

const Triangle = ({x, y, size}) => [
  <save />,
  <translate x={(boxSize - size) / 2} y={(boxSize - size) / 2} />,
  <strokeStyle value="#f00" />,
  <beginPath />,
  <moveTo x={x} y={y} />,
  <lineTo x={x+size} y={y} />,
  <lineTo x={x+size} y={y+size} />,
  <closePath />,
  <stroke />,
  <restore />,
];

const Circle = ({x, y, size}) => [
  <strokeStyle value="#000" />,
  <beginPath />,
  <arc x={x+size} y={y+size} radius={size / 2} />,
  <stroke />,
];

const Parallelogram = ({x, y, size}) => [
  <save />,
  <translate x={(boxSize - size) / 2} y={(boxSize - size) / 2} />,
  <strokeStyle value="darkgreen" />,
  <beginPath />,
  <moveTo x={x + (size / 4)} y={y} />,
  <lineTo x={x+size} y={y} />,
  <lineTo x={x+size-(size/4)} y={y+size} />,
  <lineTo x={x} y={y+size} />,
  <closePath />,
  <stroke />,
  <restore />,
];

const Jewels = {
  'square': (props) => <Square {...props} />,
  'triangle': (props) => <Triangle {...props} />,
  'circle': (props) => <Circle {...props} />,
  'parallelogram': (props) => <Parallelogram {...props} />,
};

export default (state) => state.game.cells.map((row, y) => {
  return row.map((cell, x) => {
    const { position: cursor } = state.game.cursor;
    const isCurrentCellHighlighted = cursor.x === x && cursor.y === y;

    const Jewel = Jewels[cell.shape] || (() => false);
    return (
      <CellOutline x={x * boxSize} y={y * boxSize} size={boxSize} shouldHighlight={isCurrentCellHighlighted} isAnchored={state.game.cursor.anchor}>

        <Jewel x={x * boxSize} y={y * boxSize} size={boxSize / 2} />
        
      </CellOutline>
    );
  });
});
