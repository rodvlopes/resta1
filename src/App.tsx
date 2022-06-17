import Board from './PegSolitaire'
import { userPrefesDark } from './MMUtil'
import { useEffect, useState } from 'react'

function App() {
  const className = userPrefesDark() ? 'App dark' : 'App'
  const sequence = new URLSearchParams(window.location.search).get('sequence') || ''
  const [width, setWidth] = useState(window.innerWidth - 6)
  const [height, setHeight] = useState(window.innerHeight - 6)

  const handleRisize = () => {
    setWidth(window.innerWidth - 6)
    setHeight(window.innerHeight - 6)
  }

  useEffect(() => {
    window.addEventListener('resize', handleRisize)
    return () => {
      window.removeEventListener('resize', handleRisize)
    }
  }, [])

  return (
    <div className={className}>
      <Board sequence={sequence} width={width} height={height} />
    </div>
  )
}

export default App
