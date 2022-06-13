jest.mock('./MMUtil.ts')
import { Engine, buildSequence, stringfySequence, EngineLight } from './PegSolitaire'

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

test('Engine runSequence', () => {
  const boardEngine = new Engine()
  boardEngine.runSequence('316670')
  const emptyHoles = boardEngine.holes.filter((hole) => hole.isEmpty())
  expect(emptyHoles.length).toBe(4)
})

test('Engine invalid sequence', () => {
  const boardEngine = new Engine()
  boardEngine.runSequence('22222222')
  const emptyHoles = boardEngine.holes.filter((hole) => hole.isEmpty())
  expect(emptyHoles.length).toBe(1)
})

test('EngineLight basic', () => {
  const boardEngine = new EngineLight()
  const newBoardEngine = boardEngine.runMove('31')
  expect(newBoardEngine.constructor.name).toBe('EngineLight')
  expect(newBoardEngine).not.toBe(boardEngine)
  expect(newBoardEngine.sequence).not.toBe(boardEngine.sequence)
  expect(newBoardEngine.holes).not.toBe(boardEngine.holes)
  expect(newBoardEngine.score).toBe(31)
  const possibleMoves = newBoardEngine.possibleMoves.map((m) => m[3])
  expect(possibleMoves).toEqual(['06', '41', '66'])
})

test('EngineLight initialize with sequence', () => {
  const boardEngine = new EngineLight(
    '316670717537063547553010327149436556296501091640026904443626'
  )
  const possibleMoves = boardEngine.possibleMoves.map((m) => m[3])
  expect(possibleMoves).toEqual(['07', '18'])
  expect(boardEngine.score).toBe(2)
})
