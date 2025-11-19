import { memo } from 'react'
import Block from './Block'
import './GameBoard.css'

interface Position {
  x: number
  y: number
}

interface PieceData {
  shape: number[][]
  position: Position
  type: number
}

interface GameBoardProps {
  board: number[][]
  currentPiece: PieceData | null
  ghostPiece: PieceData | null
}

// Fixed board component - only re-renders when board changes (piece locks)
const FixedBoard = memo(({ board }: { board: number[][] }) => {
  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <Block key={`${rowIndex}-${colIndex}`} type={cell} />
          ))}
        </div>
      ))}
    </div>
  )
}, (prevProps, nextProps) => {
  // Deep comparison of board array
  if (prevProps.board.length !== nextProps.board.length) return false

  for (let i = 0; i < prevProps.board.length; i++) {
    if (prevProps.board[i].length !== nextProps.board[i].length) return false
    for (let j = 0; j < prevProps.board[i].length; j++) {
      if (prevProps.board[i][j] !== nextProps.board[i][j]) return false
    }
  }

  return true
})

FixedBoard.displayName = 'FixedBoard'

// Piece overlay component - renders a tetromino at specific position
const PieceOverlay = memo(({ piece, isGhost }: { piece: PieceData, isGhost?: boolean }) => {
  return (
    <div
      className="piece-overlay"
      style={{
        top: `calc(${piece.position.y} * var(--block-size) + var(--offset))`,
        left: `calc(${piece.position.x} * var(--block-size) + var(--offset))`,
      }}
    >
      {piece.shape.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <Block
              key={`${rowIndex}-${colIndex}`}
              type={cell !== 0 ? (isGhost ? -cell : cell) : 0}
            />
          ))}
        </div>
      ))}
    </div>
  )
})

PieceOverlay.displayName = 'PieceOverlay'

function GameBoard({ board, currentPiece, ghostPiece }: GameBoardProps) {
  return (
    <div className="game-board-container">
      {/* Layer 1: Fixed board - never re-renders during piece movement */}
      <FixedBoard board={board} />

      {/* Layer 2: Ghost piece overlay */}
      {ghostPiece && <PieceOverlay piece={ghostPiece} isGhost={true} />}

      {/* Layer 3: Current piece overlay */}
      {currentPiece && <PieceOverlay piece={currentPiece} />}
    </div>
  )
}

export default memo(GameBoard)
