// Tetromino shapes and their rotations
export interface Tetromino {
  shape: number[][]
  type: number
}

// Define all 4 rotations for each tetromino
export const TETROMINOES: { [key: number]: number[][][] } = {
  1: [ // I
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]],
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]]
  ],
  2: [ // O
    [[2, 2], [2, 2]],
    [[2, 2], [2, 2]],
    [[2, 2], [2, 2]],
    [[2, 2], [2, 2]]
  ],
  3: [ // T
    [[3, 3, 3], [0, 3, 0]],
    [[0, 3], [3, 3], [0, 3]],
    [[0, 3, 0], [3, 3, 3]],
    [[3, 0], [3, 3], [3, 0]]
  ],
  4: [ // S
    [[0, 4, 4], [4, 4, 0]],
    [[4, 0], [4, 4], [0, 4]],
    [[0, 4, 4], [4, 4, 0]],
    [[4, 0], [4, 4], [0, 4]]
  ],
  5: [ // Z
    [[5, 5, 0], [0, 5, 5]],
    [[0, 5], [5, 5], [5, 0]],
    [[5, 5, 0], [0, 5, 5]],
    [[0, 5], [5, 5], [5, 0]]
  ],
  6: [ // J
    [[6, 0, 0], [6, 6, 6]],
    [[0, 6], [0, 6], [6, 6]],
    [[6, 6, 6], [0, 0, 6]],
    [[6, 6], [6, 0], [6, 0]]
  ],
  7: [ // L
    [[0, 0, 7], [7, 7, 7]],
    [[7, 0], [7, 0], [7, 7]],
    [[7, 7, 7], [7, 0, 0]],
    [[7, 7], [0, 7], [0, 7]]
  ]
}

export const getRandomTetrominoType = (): number => {
  return Math.floor(Math.random() * 7) + 1
}

export const getTetromino = (type: number, rotation: number): number[][] => {
  return TETROMINOES[type][rotation % 4]
}
