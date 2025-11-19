import { useEffect } from 'react'
import './App.css'
import GameBoard from './components/GameBoard'
import NextBlock from './components/NextBlock'
import ScoreDisplay from './components/ScoreDisplay'
import TouchControls from './components/TouchControls'
import { useGame } from './hooks/useGame'

function App() {
  const {
    board,
    currentPiece,
    ghostPiece,
    score,
    level,
    lines,
    nextPieceType,
    gameOver,
    isPaused,
    moveLeft,
    moveRight,
    rotate,
    hardDrop,
    togglePause,
    initGame
  } = useGame()

  // Initialize game on mount
  useEffect(() => {
    initGame()
  }, [initGame])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          moveLeft()
          break
        case 'ArrowRight':
          e.preventDefault()
          moveRight()
          break
        case 'ArrowDown':
          e.preventDefault()
          hardDrop()
          break
        case 'ArrowUp':
        case ' ':
          e.preventDefault()
          rotate()
          break
        case 'p':
        case 'P':
          e.preventDefault()
          togglePause()
          break
        case 'r':
        case 'R':
          if (gameOver) {
            e.preventDefault()
            initGame()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameOver, moveLeft, moveRight, rotate, hardDrop, togglePause, initGame])

  return (
    <div className="app">
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-message">
            <h2>Game Over!</h2>
            <p>Score: {score}</p>
            <button className="restart-button" onClick={initGame}>
              Restart
            </button>
          </div>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="pause-overlay">
          <div className="pause-message">
            <h2>Paused</h2>
            <button className="resume-button" onClick={togglePause}>
              Resume (P)
            </button>
          </div>
        </div>
      )}

      <div className="game-container">
        <div className="game-main">
          <GameBoard
            board={board}
            currentPiece={currentPiece}
            ghostPiece={ghostPiece}
          />
        </div>
        <div className="game-sidebar">
          <NextBlock blockType={nextPieceType} />
          <ScoreDisplay score={score} level={level} lines={lines} />
        </div>
      </div>
      <div className="controls-container">
        <TouchControls
          onMoveLeft={moveLeft}
          onMoveRight={moveRight}
          onRotate={rotate}
          onHardDrop={hardDrop}
        />
      </div>
    </div>
  )
}

export default App
