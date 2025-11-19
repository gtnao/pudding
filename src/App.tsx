import { useEffect, useState, useRef } from 'react'
import './App.css'
import GameBoard from './components/GameBoard'
import NextBlock from './components/NextBlock'
import ScoreDisplay from './components/ScoreDisplay'
import TouchControls from './components/TouchControls'
import { useGame } from './hooks/useGame'

interface LineClearEffect {
  id: number
  puddingType: number
}

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

  const [lineClearEffects, setLineClearEffects] = useState<LineClearEffect[]>([])
  const previousLines = useRef(0)

  // Initialize game on mount
  useEffect(() => {
    initGame()
  }, [initGame])

  // Detect line clear and trigger effect
  useEffect(() => {
    if (lines > previousLines.current && lines > 0) {
      const randomPudding = Math.floor(Math.random() * 7) + 1
      const newEffect: LineClearEffect = {
        id: Date.now(),
        puddingType: randomPudding
      }
      setLineClearEffects(prev => [...prev, newEffect])

      // Remove effect after animation completes
      setTimeout(() => {
        setLineClearEffects(prev => prev.filter(e => e.id !== newEffect.id))
      }, 1000)
    }
    previousLines.current = lines
  }, [lines])

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
      {/* Line clear effect */}
      {lineClearEffects.map(effect => (
        <div key={effect.id} className="line-clear-effect">
          <img
            src={`/pudding/pudding0${effect.puddingType}.png`}
            alt="pudding"
            className="attacking-pudding"
          />
        </div>
      ))}

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-message">
            <h2>Game Over!</h2>
            <p>Score: {score}</p>
            <button className="restart-button" onClick={initGame}>
              Restart
            </button>
          </div>
          {/* Mocking puddings */}
          <div className="mocking-puddings">
            {[1, 2, 3, 4, 5, 6, 7].map(type => (
              <img
                key={type}
                src={`/pudding/pudding0${type}.png`}
                alt="pudding"
                className={`mocking-pudding mocking-pudding-${type}`}
              />
            ))}
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
