import Board from './PegSolitaire'
import { userPrefesDark } from './MMUtil'

function App() {
  const className = userPrefesDark() ? 'App dark' : 'App'
  const sequence = new URLSearchParams(window.location.search).get('sequence') || ''

  return (
    <div className={className}>
      <Board sequence={sequence} />
    </div>
  )
}

export default App
