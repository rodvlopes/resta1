import { render, screen } from '@testing-library/react'
import App from './App'

jest.mock('./MMUtil.ts')

test('renders learn react link', () => {
  render(<App />)
  const remainingElement = screen.getByText(/Remaining 32/)
  const resetElement = screen.getByText(/Reset/)
  expect(remainingElement).toBeInTheDocument()
  expect(resetElement).toBeInTheDocument()
})
