//winning sequence: "31667071753706354755301032714943655629650109164002690444362607"
import React, { SetStateAction, useState } from 'react'
import useD3 from './Hooks'
import { buildWorker } from './WorkerSample'

// simple react setState example: https://codepen.io/Hafoux/pen/ZEOwzdQ?editors=1010

/*
var positions = 
         [00,01,02,
          03,04,05,
    06,07,08,09,10,11,12,
    13,14,15,16,17,18,19,
    20,21,22,23,24,25,26,
          27,28,29,
          30,31,32]

    33 positions
*/

//TODO: rename Slot/Spot to Hole
//TODO: set a namespace

declare const d3: any

type MoveT = [from: number, mid: number, to: number, id: string]

class BoardSlot {
  x: number
  y: number
  id: number
  state: '' | 'empty' | 'destination' | 'selected' //TODO: rename '' -> 'peg'
  validMoves: MoveT[]
  refMove: MoveT | null

  constructor(
    { x, y }: { x: number; y: number },
    id: number,
    slotw: number,
    sloth: number,
    dslotw: number,
    dsloth: number,
    validMoves: MoveT[]
  ) {
    this.id = id
    this.state = id == 16 ? 'empty' : '' //TODO: name 16-magic-number
    this.validMoves = validMoves
    this.validMoves = validMoves
    this.refMove = null
    //Adiciona o deslocamento para centralizar o círculo
    this.x = x * slotw + dslotw
    this.y = y * sloth + dsloth
  }

  empty() {
    return this.state == 'empty' || this.state == 'destination'
  }

  destination() {
    return this.state == 'destination'
  }

  selected() {
    return this.state == 'selected'
  }

  cleanState() {
    switch (this.state) {
      case 'selected':
        this.state = ''
        break
      case 'destination':
        this.state = 'empty'
        break
    }
  }

  possibleMoves(boardSlots: BoardSlot[]) {
    return this.validMoves.filter(
      ([from, mid, to]: MoveT) =>
        !boardSlots[from].empty() && !boardSlots[mid].empty() && boardSlots[to].empty()
    )
  }

  reset() {
    this.state = this.id == 16 ? 'empty' : ''
  }

  select() {
    this.state = 'selected'
  }

  setEmpty() {
    this.state = 'empty'
  }

  setPeg() {
    this.state = ''
  }

  setDestination(move: MoveT) {
    this.state = 'destination'
    this.refMove = move
  }
}

export class Sequence extends Array {
  constructor(a0: string | number = '', ...args: any[]) {
    // console.log(a0, typeof a0)
    if (args.length == 0) {
      super()
      if (typeof a0 == 'number') {
        this.push(a0)
      } else {
        ;(a0.match(/.{2}/g) || []).forEach((mi: string) => this.push(parseInt(mi)))
      }
    } else {
      // @ts-ignore
      super(a0, ...args)
    }
  }

  add(mi: string | number) {
    const toAdd = typeof mi == 'string' ? parseInt(mi) : mi
    return new Sequence(...this, toAdd)
  }

  remove(mi: string | number) {
    const toRemove = typeof mi == 'string' ? parseInt(mi) : mi
    return new Sequence(...[...this].filter((it) => it != toRemove))
  }

  toString() {
    return [...this].map((mi) => `${mi.toString()}`.padStart(2, '0')).join('')
  }
}

// prettier-ignore
const validMoves : MoveT[] = [
  [0, 1, 2],    [0, 3, 8],    [1, 4, 9],    [2, 1, 0],    [2, 5, 10],   [3, 4, 5],
  [3, 8, 15],   [4, 9, 16],   [5, 4, 3],    [5, 10, 17],  [6, 7, 8],    [6, 13, 20],
  [7, 8, 9],    [7, 14, 21],  [8, 3, 0],    [8, 7, 6],    [8, 9, 10],   [8, 15, 22],
  [9, 4, 1],    [9, 8, 7],    [9, 10, 11],  [9, 16, 23],  [10, 5, 2],   [10, 9, 8],
  [10, 11, 12], [10, 17, 24], [11, 10, 9],  [11, 18, 25], [12, 11, 10], [12, 19, 26],
  [13, 14, 15], [14, 15, 16], [15, 8, 3],   [15, 14, 13], [15, 16, 17], [15, 22, 27],
  [16, 9, 4],   [16, 15, 14], [16, 17, 18], [16, 23, 28], [17, 10, 5],  [17, 16, 15],
  [17, 18, 19], [17, 24, 29], [18, 17, 16], [19, 18, 17], [20, 13, 6],  [20, 21, 22],
  [21, 14, 7],  [21, 22, 23], [22, 15, 8],  [22, 21, 20], [22, 23, 24], [22, 27, 30],
  [23, 16, 9],  [23, 22, 21], [23, 24, 25], [23, 28, 31], [24, 17, 10], [24, 23, 22],
  [24, 25, 26], [24, 29, 32], [25, 18, 11], [25, 24, 23], [26, 19, 12], [26, 25, 24],
  [27, 22, 15], [27, 28, 29], [28, 23, 16], [29, 24, 17], [29, 28, 27], [30, 27, 22],
  [30, 31, 32], [31, 28, 23], [32, 29, 24], [32, 31, 30], 
].map((m, mi) => [m[0], m[1], m[2], `${mi}`.padStart(2, '0')]) //TS complains about ...m

// prettier-ignore
const initialState = [
                              {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0},
                              {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1},
  {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2},
  {x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 6, y: 3},
  {x: 0, y: 4}, {x: 1, y: 4}, {x: 2, y: 4}, {x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 6, y: 4},
                              {x: 2, y: 5}, {x: 3, y: 5}, {x: 4, y: 5},
                              {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6},
]

type BoardConfigT = {
  width?: number
  height?: number
  container?: string
  noView?: boolean
  compactView?: boolean
  sequenceStr?: string
}

const pad2 = (i: number): string => `${i.toString()}`.padStart(2, '0')

function Board2({
  width = window.innerWidth - 6,
  height = window.innerHeight - 6,
  compactView = false,
  sequenceStr = '',
}: BoardConfigT = {}) {
  const slotw = Math.floor(width / 7),
    dslotw = Math.floor(slotw / 2),
    sloth = Math.floor(height / 7),
    dsloth = Math.floor(sloth / 2),
    spotRadius = Math.floor(0.35 * Math.min(slotw, sloth))

  const [slots, setSlots] = React.useState(
    initialState.map((pos, i) => {
      const slotValidMoves = validMoves.filter((m) => i == m[0])
      return new BoardSlot(pos, i, slotw, sloth, dslotw, dsloth, slotValidMoves)
    })
  )
  const [sequence, setSequence] = React.useState(new Sequence())
  const [solutionFinderWorker, setSolutionFinderWorker]: [Worker | undefined, any] =
    React.useState()
  const [solutionsFound, setSolutionsFound]: [any[] | undefined, any] = React.useState()

  // const centralHole = slots[16]

  const score = 32 - sequence.length //TODO: name 32-magic-number

  /**
   * Determines the possible moves available in the current board state
   */
  // const possibleMoves = () : MoveT[] => {
  //   return slots.map((spot) => spot.possibleMoves(this.slots)).flat()
  // }

  // get possibleMovesIndexes(): string[] {
  //   return possibleMoves().map((m) => m[3])
  // }

  const runMove = React.useCallback((m: MoveT) => {
    const [from, mid, to, moveIndex] = m
    const slotFrom = slots[from]
    const slotMid = slots[mid]
    const slotTo = slots[to]
    if (slotFrom.possibleMoves(slots).includes(m)) {
      slotTo.setPeg()
      slotMid.setEmpty()
      slotFrom.setEmpty()
      const nSeq = sequence.add(moveIndex)
      console.log(nSeq)
      setSequence(nSeq)
      return true
    } else {
      console.log('Movement not allowed on this state: ', m.toString())
      return false
    }
  }, [])

  const cleanState = () => {
    slots.forEach((spot) => spot.cleanState())
  }

  const selectSpot = (spot: BoardSlot) => {
    spot.select()
    spot.possibleMoves(slots).forEach((m) => slots[m[2]].setDestination(m)) //m[2] -> slotTo
  }

  const runSequence = (seq: string) => {
    new Sequence(seq).forEach((mi) => {
      const m = validMoves[mi]
      runMove(m)
    })
  }

  const runSequenceAnimated = (seq: string) => {
    new Sequence(seq).forEach((mi, i) => {
      setTimeout(() => {
        const m = validMoves[mi]
        runMove(m)
      }, 500 * i)
    })
  }

  const undoLastMove = () => {
    if (sequence.length > 0) {
      const mi = sequence.pop()
      const [from, mid, to] = validMoves[mi]
      slots[to].state = 'empty'
      slots[mid].state = ''
      slots[from].state = ''
      setSequence(sequence.remove(mi))
    }
  }

  const reset = React.useCallback(() => {
    slots.forEach((slot) => slot.reset())
    setSequence(new Sequence())
  }, [])

  const findSolutions = () => {
    if (solutionFinderWorker) {
      solutionFinderWorker.terminate()
    }

    const worker = buildWorker()

    worker.addEventListener(
      'message',
      (e) => {
        if (e.data.solucoes) {
          setSolutionsFound(e.data.solucoes)
          console.log('Solutions found:', e.data.solucoes)
        } else {
          console.log(e.data)
        }
      },
      false
    )

    worker.onerror = function (event) {
      console.error(event)
    }

    worker.postMessage({ sequenciaInicial: sequence.toString(), noCentro: true })

    setSolutionFinderWorker(worker)
  }

  //TODO: define this function out of component
  const clickSpotHandler = React.useCallback((_ev: PointerEvent, spot: BoardSlot) => {
    if (spot.destination()) {
      //run movement and remove one peg
      if (spot.refMove) {
        runMove(spot.refMove)
        cleanState()
        setSlots([...slots]) //force update
      }
    } else if (spot.empty()) {
      //nothing to do
    } else {
      //select peg
      cleanState()
      selectSpot(spot)
      setSlots([...slots]) //force update
    }
  }, [])

  console.log('sequence', sequence.length)

  const ref = useD3(
    (svg) => {
      console.log('sequence useD3', sequence.length)
      const isUpdate = svg.selectAll('g.node').size() > 0
      if (isUpdate) {
        //update svg
        svg
          .selectAll('circle')
          .data(slots)
          .attr('class', function (d: any) {
            return d.state
          })

        if (compactView) {
          svg.select('.score').text(function () {
            return score.toString()
          })
        } else {
          svg.select('.score').text(function () {
            return `Remaining ${score}`
          })

          if (score == 1) {
            svg.select('.solucoes').text('tu é o cara!')
          } else if (solutionsFound) {
            svg.select('.solucoes').text(`There are ${solutionsFound.length} possible solutions`)
          }
        }
      } else {
        //create svg
        const g = svg
          .selectAll('g.node')
          .data(slots)
          .enter()
          .append('svg:g')
          .attr('class', 'node')
          .attr('transform', function (d: any) {
            return 'translate(' + d.x + ',' + d.y + ')'
          })
          .on('click', clickSpotHandler)

        g.append('svg:circle')
          .attr('class', (spot: any) => spot.state)
          .attr('r', spotRadius)

        if (compactView) {
          svg
            .append('svg:text')
            .attr('x', width - 21)
            .attr('y', height - 10)
            .attr('class', 'score')
            .text(() => score.toString())
        } else {
          g.append('svg:text')
            .attr('x', '-0.5em')
            .attr('dy', '.31em')
            .text((_d: any, i: number) => pad2(i))

          svg
            .append('svg:text')
            .attr('x', width - 130)
            .attr('y', height - 30 + 'px')
            .attr('class', 'score')
            .text(() => `Remaining ${score}`)

          svg
            .append('svg:text')
            .attr('x', 30)
            .attr('y', height - 30 + 'px')
            .attr('class', 'solucoes')
            .text('')

          svg
            .append('svg:text')
            .attr('x', width - 130)
            .attr('y', 30 + 'px')
            .attr('class', 'resetButton')
            .text('Reset')
            .on('click', () => reset())
        }
      }
    },
    [slots, sequence, solutionsFound, compactView]
  )

  runSequence(sequenceStr)
  //TODO: name 13-magic-number
  if (score < 13) {
    findSolutions()
  }

  return (
    <svg
      // @ts-ignore
      ref={ref}
      style={{
        height,
        width,
      }}
    ></svg>
  )
}

export default Board2
