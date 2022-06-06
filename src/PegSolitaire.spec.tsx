import React from 'react'
// import { render, screen } from '@testing-library/react'
jest.mock('./WorkerSample.ts')
import { Sequence } from './PegSolitaire'

test('Sequence', () => {
  expect(new Sequence().toString()).toEqual('')
  expect(new Sequence(50).toString()).toEqual('50')
  expect(new Sequence(11, 2).toString()).toEqual('1102')
  expect(new Sequence('0102').toString()).toEqual('0102')
})

test('Sequence.add', () => {
  const seq = new Sequence()
  const seq1 = seq.add('01') //add will create a new Sequence instance with the new item
  expect(seq).not.toEqual(seq1)
  expect(seq1).toEqual([1])
  const seq2 = seq1.add(20)
  expect(seq2).toEqual([1, 20])
})

test('Sequence.remove', () => {
  const seq = new Sequence('0301')
  const seq1 = seq.remove('01') //remove will create a new Sequence instance with the new item
  expect(seq).not.toEqual(seq1)
  expect(seq1).toEqual([3])
  const seq2 = seq1.remove(3)
  expect(seq2).toEqual([])
})

test('Sequence performace check', () => {
  const seq = new Sequence()
  console.time('t1')
  for (let i = 0; i < 1000000; i++) {
    const el = seq[i]
    seq.add(1).remove(1)
  }
  console.timeEnd('t1')
  expect('no error').toEqual('no error')
})
