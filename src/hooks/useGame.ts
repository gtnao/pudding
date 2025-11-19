import { useState, useCallback, useEffect, useRef } from 'react'
import {
  createEmptyBoard,
  canPlacePiece,
  mergePieceToBoard,
  clearLines,
  calculateScore,
  getBoardWithPiece,
  getGhostPosition,
  BOARD_WIDTH,
  type Board,
  type Position,
  type CurrentPiece
} from '../game/gameLogic'
import {
  getRandomTetrominoType,
  getTetromino
} from '../game/tetrominoes'

interface GameState {
  board: Board
  currentPiece: CurrentPiece | null
  nextPieceType: number
  score: number
  level: number
  lines: number
  gameOver: boolean
  isPaused: boolean
}

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPieceType: getRandomTetrominoType(),
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    isPaused: false
  })

  const dropIntervalRef = useRef<number | null>(null)

  // Spawn new piece
  const spawnPiece = useCallback((board: Board, pieceType?: number): CurrentPiece | null => {
    const type = pieceType ?? getRandomTetrominoType()
    const rotation = 0
    const piece = getTetromino(type, rotation)
    const position: Position = {
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(piece[0].length / 2),
      y: 0
    }

    if (!canPlacePiece(board, piece, position)) {
      return null // Game over
    }

    return { type, rotation, position }
  }, [])

  // Initialize game
  const initGame = useCallback(() => {
    const board = createEmptyBoard()
    const nextPieceType = getRandomTetrominoType()
    const currentPiece = spawnPiece(board, getRandomTetrominoType())

    setGameState({
      board,
      currentPiece,
      nextPieceType,
      score: 0,
      level: 1,
      lines: 0,
      gameOver: currentPiece === null,
      isPaused: false
    })
  }, [spawnPiece])

  // Move piece
  const movePiece = useCallback((dx: number, dy: number) => {
    setGameState(prev => {
      if (prev.gameOver || prev.isPaused || !prev.currentPiece) return prev

      const piece = getTetromino(prev.currentPiece.type, prev.currentPiece.rotation)
      const newPosition: Position = {
        x: prev.currentPiece.position.x + dx,
        y: prev.currentPiece.position.y + dy
      }

      if (canPlacePiece(prev.board, piece, newPosition)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: newPosition
          }
        }
      }

      // If moving down and can't, lock the piece
      if (dy > 0) {
        const newBoard = mergePieceToBoard(prev.board, piece, prev.currentPiece.position)
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)
        const newLines = prev.lines + linesCleared
        const newLevel = Math.floor(newLines / 3) + 1
        const newScore = prev.score + calculateScore(linesCleared, prev.level)

        const nextPiece = spawnPiece(clearedBoard, prev.nextPieceType)

        return {
          ...prev,
          board: clearedBoard,
          currentPiece: nextPiece,
          nextPieceType: getRandomTetrominoType(),
          score: newScore,
          level: newLevel,
          lines: newLines,
          gameOver: nextPiece === null
        }
      }

      return prev
    })
  }, [spawnPiece])

  // Rotate piece
  const rotatePiece = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.isPaused || !prev.currentPiece) return prev

      const newRotation = (prev.currentPiece.rotation + 1) % 4
      const rotatedPiece = getTetromino(prev.currentPiece.type, newRotation)

      if (canPlacePiece(prev.board, rotatedPiece, prev.currentPiece.position)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            rotation: newRotation
          }
        }
      }

      return prev
    })
  }, [])

  // Hard drop
  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.isPaused || !prev.currentPiece) return prev

      const piece = getTetromino(prev.currentPiece.type, prev.currentPiece.rotation)
      let newY = prev.currentPiece.position.y

      // Find lowest valid position
      while (canPlacePiece(prev.board, piece, { x: prev.currentPiece.position.x, y: newY + 1 })) {
        newY++
      }

      const finalPosition: Position = {
        x: prev.currentPiece.position.x,
        y: newY
      }

      const newBoard = mergePieceToBoard(prev.board, piece, finalPosition)
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)
      const newLines = prev.lines + linesCleared
      const newLevel = Math.floor(newLines / 3) + 1
      const newScore = prev.score + calculateScore(linesCleared, prev.level)

      const nextPiece = spawnPiece(clearedBoard, prev.nextPieceType)

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: nextPiece,
        nextPieceType: getRandomTetrominoType(),
        score: newScore,
        level: newLevel,
        lines: newLines,
        gameOver: nextPiece === null
      }
    })
  }, [spawnPiece])

  // Toggle pause
  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }))
  }, [])

  // Auto drop
  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) {
      if (dropIntervalRef.current !== null) {
        clearInterval(dropIntervalRef.current)
        dropIntervalRef.current = null
      }
      return
    }

    const dropSpeed = Math.max(50, 300 - (gameState.level - 1) * 80)

    dropIntervalRef.current = window.setInterval(() => {
      movePiece(0, 1)
    }, dropSpeed)

    return () => {
      if (dropIntervalRef.current !== null) {
        clearInterval(dropIntervalRef.current)
      }
    }
  }, [gameState.gameOver, gameState.isPaused, gameState.level, movePiece])

  // Get ghost position
  const getGhostPiece = useCallback(() => {
    if (!gameState.currentPiece) return null

    const piece = getTetromino(gameState.currentPiece.type, gameState.currentPiece.rotation)
    const ghostPos = getGhostPosition(gameState.board, piece, gameState.currentPiece.position)

    return {
      shape: piece,
      position: ghostPos,
      type: gameState.currentPiece.type
    }
  }, [gameState.board, gameState.currentPiece])

  return {
    board: gameState.board,
    currentPiece: gameState.currentPiece ? {
      shape: getTetromino(gameState.currentPiece.type, gameState.currentPiece.rotation),
      position: gameState.currentPiece.position,
      type: gameState.currentPiece.type
    } : null,
    ghostPiece: getGhostPiece(),
    score: gameState.score,
    level: gameState.level,
    lines: gameState.lines,
    nextPieceType: gameState.nextPieceType,
    gameOver: gameState.gameOver,
    isPaused: gameState.isPaused,
    moveLeft: () => movePiece(-1, 0),
    moveRight: () => movePiece(1, 0),
    moveDown: () => movePiece(0, 1),
    rotate: rotatePiece,
    hardDrop,
    togglePause,
    initGame
  }
}
