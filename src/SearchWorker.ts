import { findSolutions } from './Search'

global.self.onmessage = ({ data: { initialSequence, inTheMiddle, maxSolutions } }) => {
  global.self.postMessage({
    solutions: findSolutions(initialSequence, inTheMiddle, maxSolutions),
  })
  global.self.close()
}
