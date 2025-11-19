export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20

export type Board = number[][]

export interface Position {
  x: number
  y: number
}

export interface CurrentPiece {
  type: number
  rotation: number
  position: Position
}

// Create empty board
export const createEmptyBoard = (): Board => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => 0)
  )
}

// Check if piece can be placed at given position
export const canPlacePiece = (
  board: Board,
  piece: number[][],
  position: Position
): boolean => {
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col] !== 0) {
        const boardRow = position.y + row
        const boardCol = position.x + col

        // Check bounds
        if (
          boardRow < 0 ||
          boardRow >= BOARD_HEIGHT ||
          boardCol < 0 ||
          boardCol >= BOARD_WIDTH
        ) {
          return false
        }

        // Check collision with existing pieces
        if (board[boardRow][boardCol] !== 0) {
          return false
        }
      }
    }
  }
  return true
}

// Merge piece into board
export const mergePieceToBoard = (
  board: Board,
  piece: number[][],
  position: Position
): Board => {
  const newBoard = board.map(row => [...row])

  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col] !== 0) {
        const boardRow = position.y + row
        const boardCol = position.x + col
        if (boardRow >= 0 && boardRow < BOARD_HEIGHT &&
            boardCol >= 0 && boardCol < BOARD_WIDTH) {
          newBoard[boardRow][boardCol] = piece[row][col]
        }
      }
    }
  }

  return newBoard
}

// Check and clear completed lines
export const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  let linesCleared = 0
  const newBoard: Board = []

  for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
    if (board[row].every(cell => cell !== 0)) {
      linesCleared++
    } else {
      newBoard.unshift(board[row])
    }
  }

  // Add new empty rows at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => 0))
  }

  return { newBoard, linesCleared }
}

// Calculate score based on lines cleared
export const calculateScore = (linesCleared: number, level: number): number => {
  const baseScores = [0, 100, 300, 500, 800]
  return baseScores[linesCleared] * level
}

// Get ghost position (where piece would land)
export const getGhostPosition = (
  board: Board,
  piece: number[][],
  position: Position
): Position => {
  let ghostY = position.y

  while (canPlacePiece(board, piece, { x: position.x, y: ghostY + 1 })) {
    ghostY++
  }

  return { x: position.x, y: ghostY }
}

// Get board with current piece and ghost piece rendered
export const getBoardWithPiece = (
  board: Board,
  piece: number[][],
  position: Position,
  showGhost: boolean = true
): Board => {
  const displayBoard = board.map(row => [...row])

  // Render ghost piece (use negative values to differentiate)
  if (showGhost) {
    const ghostPos = getGhostPosition(board, piece, position)
    if (ghostPos.y !== position.y) {
      for (let row = 0; row < piece.length; row++) {
        for (let col = 0; col < piece[row].length; col++) {
          if (piece[row][col] !== 0) {
            const boardRow = ghostPos.y + row
            const boardCol = ghostPos.x + col
            if (boardRow >= 0 && boardRow < BOARD_HEIGHT &&
                boardCol >= 0 && boardCol < BOARD_WIDTH) {
              // Use negative value to represent ghost
              displayBoard[boardRow][boardCol] = -piece[row][col]
            }
          }
        }
      }
    }
  }

  // Render current piece
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col] !== 0) {
        const boardRow = position.y + row
        const boardCol = position.x + col
        if (boardRow >= 0 && boardRow < BOARD_HEIGHT &&
            boardCol >= 0 && boardCol < BOARD_WIDTH) {
          displayBoard[boardRow][boardCol] = piece[row][col]
        }
      }
    }
  }

  return displayBoard
}
