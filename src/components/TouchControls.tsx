import './TouchControls.css'

interface TouchControlsProps {
  onMoveLeft?: () => void
  onMoveRight?: () => void
  onRotate?: () => void
  onHardDrop?: () => void
}

function TouchControls({
  onMoveLeft = () => {},
  onMoveRight = () => {},
  onRotate = () => {},
  onHardDrop = () => {},
}: TouchControlsProps) {
  return (
    <div className="touch-controls">
      <div className="control-row control-row-single">
        <button className="control-button hard-drop-btn" onClick={onHardDrop}>
          ↓
        </button>
      </div>
      <div className="control-row">
        <button className="control-button left-btn" onClick={onMoveLeft}>
          ←
        </button>
        <button className="control-button rotate-btn" onClick={onRotate}>
          ↻
        </button>
        <button className="control-button right-btn" onClick={onMoveRight}>
          →
        </button>
      </div>
    </div>
  )
}

export default TouchControls
