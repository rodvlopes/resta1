import { act, render, screen, waitFor } from '@testing-library/react'
import App from './App'
import Board from './PegSolitaire'

jest.mock('./MMUtil.ts')

test('renders board with a initial sequence of two steps and than reset', () => {
  //setup url.search
  Object.defineProperty(global.window, 'location', {
    value: {
      search: '?sequence=3166',
    },
    writable: true,
  })

  render(<App />)
  const remainingElement = screen.getByText(/Remaining 30/)
  const resetElement = screen.getByText(/Reset/)
  expect(remainingElement).toBeInTheDocument()
  expect(resetElement).toBeInTheDocument()
  act(() => {
    /* fire events that update state */
    resetElement.dispatchEvent(new Event('click')) //.click doesnt work on svg element
  })
  const newRemainingElement = screen.getByText(/Remaining 32/)
  expect(newRemainingElement).toBeInTheDocument()

  //cleanup url.search
  Object.defineProperty(global.window, 'location', {
    value: {
      search: '',
    },
    writable: true,
  })
})

test('renders a board and play a movement 18 -> 16', async () => {
  render(<App />)
  const remainingElement = screen.getByText(/Remaining 32/)
  expect(remainingElement).toBeInTheDocument()
  act(() => {
    screen.getByText(/18/).parentElement?.dispatchEvent(new Event('click')) //.click doesnt work on svg element
  })
  expect(screen.getByText(/18/).previousSibling).toHaveClass('selected')
  expect(screen.getByText(/16/).previousSibling).toHaveClass('destination')

  act(() => {
    screen.getByText(/16/).parentElement?.dispatchEvent(new Event('click')) //.click doesnt work on svg element
  })
  expect(screen.getByText(/18/).previousSibling).toHaveClass('empty')
  expect(screen.getByText(/16/).previousSibling).toHaveClass('peg')
})
