import React from 'react'
import Board2 from './PegSolitaire'
import { userPrefesDark } from './MMUtil'

function App() {
  const className = userPrefesDark() ? 'App dark' : 'App'

  return (
    <div className={className}>
      <Board2 sequence={new URLSearchParams(document.location.search).get('sequence') || ''} />
    </div>
  )
}

export default App
