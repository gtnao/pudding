import './ScoreDisplay.css'

interface ScoreDisplayProps {
  score?: number
  level?: number
  lines?: number
}

function ScoreDisplay({ score = 0, level = 1, lines = 0 }: ScoreDisplayProps) {
  return (
    <div className="score-display">
      <div className="score-item">
        <span className="score-label">Score</span>
        <span className="score-value">{score}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Level</span>
        <span className="score-value">{level}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Lines</span>
        <span className="score-value">{lines}</span>
      </div>
    </div>
  )
}

export default ScoreDisplay
