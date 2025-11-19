import Block from './Block'
import { getTetromino } from '../game/tetrominoes'
import './NextBlock.css'

interface NextBlockProps {
  blockType: number // 1-7 for different tetromino types
}

function NextBlock({ blockType }: NextBlockProps) {
  const shape = getTetromino(blockType, 0)

  return (
    <div className="next-block-container">
      <h3>Next</h3>
      <div className="next-block-preview">
        <div className="next-block-shape">
          {shape.map((row, rowIndex) => (
            <div key={rowIndex} className="next-block-row">
              {row.map((cell, cellIndex) => (
                <Block key={cellIndex} type={cell} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NextBlock
