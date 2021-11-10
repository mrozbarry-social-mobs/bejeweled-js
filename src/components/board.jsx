/**
 * @jsx c
 * @jsxFactory c
 */
import { c } from 'declarativas';

const CellOutline = ({x, y, size, shouldHighlight, isAnchored}, children) => (
  <g>
    <strokeStyle value={isAnchored ? 'black' : '#ddd'} />
    <lineWidth value={isAnchored ? 4 : 2} />

    {shouldHighlight && <strokeRect x={x} y={y} width={size} height={size} />}

    {children}
  </g>
);
const boxScale = 1/10;

const Jewel = ({ x, y, size, character, boxSize }) => (
  <g>
    <save />
    <translate x={(boxSize) / 2} y={(boxSize) / 2} />
    <font value={`${character ? size : size * 1.75}px sans-serif`} />
    <textAlign value="center" />
    <textBaseline value="middle" />
    <strokeStyle value="black" />
    <strokeText x={x} y={y} text={character || '💥'} />
    <restore />
  </g>
);

const RemainingSwaps = ({remainingSwaps}) => (
  <g>
    <save /> 
    <font value={`64px sans-serif`} />
    <strokeStyle value="black" />
    <strokeText x={0} y={0} text={remainingSwaps} />
    <restore />
  </g>
);



export default (state) => {
  const boxSize = boxScale * Math.min(state.canvas.rect.w, state.canvas.rect.h);

  return (
    <g>
      <translate
        x={(state.canvas.rect.w - (state.game.gridSize * boxSize)) / 2}
        y={(state.canvas.rect.h - (state.game.gridSize * boxSize)) / 2}
      />
      <RemainingSwaps remainingSwaps={state.game.remainingSwaps} />  
      {state.game.cells.map((row, y) => row.map((cell, x) => {
        const { position: cursor } = state.game.cursor;
        const isCurrentCellHighlighted = cursor.x === x && cursor.y === y;

        return (
          <CellOutline x={x * boxSize} y={y * boxSize} size={boxSize} shouldHighlight={isCurrentCellHighlighted} isAnchored={state.game.cursor.anchor}>

            <Jewel boxSize={boxSize} x={x * boxSize} y={y * boxSize} size={boxSize / (isCurrentCellHighlighted ? 1.2 : 1.6)} character={cell} />
            
          </CellOutline>
        );
      }))}
    </g>
  );
}
