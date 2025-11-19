import { memo } from 'react'
import './Block.css'

interface BlockProps {
  type: number // 1-7 for pudding01.png to pudding07.png, 0 for empty, negative for ghost
}

function Block({ type }: BlockProps) {
  if (type === 0) {
    return <div className="block block-empty" />
  }

  // Ghost piece (negative value)
  const isGhost = type < 0
  const actualType = Math.abs(type)

  return (
    <div
      className={`block block-filled ${isGhost ? 'block-ghost' : ''}`}
      style={{
        backgroundImage: `url(/pudding/pudding0${actualType}.png)`
      }}
    />
  )
}

export default memo(Block)
