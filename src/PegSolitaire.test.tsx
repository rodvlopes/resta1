jest.mock('./MMUtil.ts')
import { buildSequence, stringfySequence, Engine } from './PegSolitaire'

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

test('Engine invalid sequence', () => {
  const boardEngine = new Engine('2222')
  const emptyHoles = boardEngine.holes.filter((h) => h == 0)
  expect(emptyHoles.length).toBe(1)
})

test('Engine basic', () => {
  const boardEngine = new Engine()
  const newBoardEngine = boardEngine.runMove('31')
  expect(newBoardEngine.constructor.name).toBe('Engine')
  expect(newBoardEngine).not.toBe(boardEngine)
  expect(newBoardEngine.sequence).not.toBe(boardEngine.sequence)
  expect(newBoardEngine.holes).not.toBe(boardEngine.holes)
  expect(newBoardEngine.score).toBe(31)
  const possibleMoves = newBoardEngine.possibleMoves.map((m) => m[3])
  expect(possibleMoves).toEqual(['06', '41', '66'])
})

test('Engine basic', () => {
  const boardEngine = new Engine('31')
  const newBoardEngine = boardEngine.undoLastMove()
  expect(newBoardEngine.constructor.name).toBe('Engine')
  expect(newBoardEngine).not.toBe(boardEngine)
  expect(newBoardEngine.sequence).not.toBe(boardEngine.sequence)
  expect(newBoardEngine.holes).not.toBe(boardEngine.holes)
  expect(newBoardEngine.score).toBe(32)
})

test('Engine initialize with sequence', () => {
  const boardEngine = new Engine('316670717537063547553010327149436556296501091640026904443626')
  const possibleMoves = boardEngine.possibleMoves.map((m) => m[3])
  expect(possibleMoves).toEqual(['07', '18'])
  expect(boardEngine.score).toBe(2)
})
