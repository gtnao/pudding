import Block from './Block'
import './BlockShowcase.css'

// Tetromino shapes: 1=I, 2=O, 3=T, 4=S, 5=Z, 6=J, 7=L
const tetrominoes = [
  {
    type: 1,
    name: 'I',
    shape: [
      [1, 1, 1, 1]
    ]
  },
  {
    type: 2,
    name: 'O',
    shape: [
      [2, 2],
      [2, 2]
    ]
  },
  {
    type: 3,
    name: 'T',
    shape: [
      [3, 3, 3],
      [0, 3, 0]
    ]
  },
  {
    type: 4,
    name: 'S',
    shape: [
      [0, 4, 4],
      [4, 4, 0]
    ]
  },
  {
    type: 5,
    name: 'Z',
    shape: [
      [5, 5, 0],
      [0, 5, 5]
    ]
  },
  {
    type: 6,
    name: 'J',
    shape: [
      [6, 0, 0],
      [6, 6, 6]
    ]
  },
  {
    type: 7,
    name: 'L',
    shape: [
      [0, 0, 7],
      [7, 7, 7]
    ]
  }
]

function BlockShowcase() {
  return (
    <div className="block-showcase">
      <h3>Blocks</h3>
      <div className="blocks-grid">
        {tetrominoes.map((tetromino) => (
          <div key={tetromino.type} className="block-item">
            <div className="tetromino-shape">
              {tetromino.shape.map((row, rowIndex) => (
                <div key={rowIndex} className="tetromino-row">
                  {row.map((cell, cellIndex) => (
                    <Block key={cellIndex} type={cell} />
                  ))}
                </div>
              ))}
            </div>
            <span className="block-label">{tetromino.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlockShowcase
