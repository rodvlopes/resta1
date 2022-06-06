import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

jest.mock('./WorkerSample.ts')

test('renders learn react link', () => {
  render(<App />)
  const linkElement = screen.getByText(/Peg Solitaire/i)
  expect(linkElement).toBeInTheDocument()
})
