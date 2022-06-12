jest.mock('./Util.ts')
import { Engine, buildSequence, stringfySequence } from './PegSolitaire'

test('buildSequence', () => {
  expect([...buildSequence('010203')]).toEqual([1, 2, 3])
  expect([...buildSequence('')]).toEqual([])
  expect([...buildSequence([1, 2])]).toEqual([1, 2])
  expect(buildSequence([1, 2]).toString()).toEqual('0102')
})

test('stringfySequence', () => {
  expect(stringfySequence([1, 2, 3])).toEqual('010203')
  expect(stringfySequence([])).toEqual('')
})

test('Engine possibleMoves', () => {
  const boardEngine = new Engine()
  const possibleMoves = boardEngine.possibleMoves.map((m) => m[3])
  expect(possibleMoves).toEqual(['07', '31', '44', '68'])
})

test('Engine possibleMoves with initialSequence', () => {
  const boardEngine = new Engine('31')
  const possibleMoves = boardEngine.possibleMoves.map((m) => m[3])
  expect(possibleMoves).toEqual(['06', '41', '66'])
})

test('Engine possibleMoves with initialSequence (last move)', () => {
  const boardEngine = new Engine('316670717537063547553010327149436556296501091640026904443626')
  const possibleMoves = boardEngine.possibleMoves.map((m) => m[3])
  expect(possibleMoves).toEqual(['07', '18'])
})
