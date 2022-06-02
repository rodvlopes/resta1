//winning sequence: "31667071753706354755301032714943655629650109164002690444362607"

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

type MoveT = [number, number, number, string]

class BoardSlot {
  x: number
  y: number
  id: number
  state: '' | 'empty' | 'destination' | 'selected' //TODO: '' -> 'peg'
  validMoves: MoveT[]
  refMove: MoveT | null

  constructor({ x, y }: { x: number; y: number }, id: number) {
    this.x = x
    this.y = y
    this.id = id
    this.state = id == 16 ? 'empty' : '' //TODO: assign 16-magic-number
    this.validMoves = []
    this.refMove = null
  }

  setup(slotw: number, sloth: number, dslotw: number, dsloth: number, validMoves: MoveT[]) {
    //Adiciona o deslocamento para centralizar o círculo
    this.x = this.x * slotw + dslotw
    this.y = this.y * sloth + dsloth
    this.validMoves = validMoves
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

class Board {
  width = 400
  height = 300
  container = 'body'
  noView = false
  compactView = false
  spotRadius: number
  sequence = new Sequence()
  view: any
  solutionFinderWorker: Worker | null = null

  // prettier-ignore
  slots : BoardSlot[] = [
                                  {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0},
                                  {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1},
      {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2},
      {x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 6, y: 3},
      {x: 0, y: 4}, {x: 1, y: 4}, {x: 2, y: 4}, {x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 6, y: 4},
                                  {x: 2, y: 5}, {x: 3, y: 5}, {x: 4, y: 5},
                                  {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6},
    ].map((pos, i) => new BoardSlot(pos, i))

  // prettier-ignore
  // one validMove is [from, middle, to, id]
  validMoves : MoveT[] = [
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

  constructor(
    config: {
      width?: number
      height?: number
      container?: string
      noView?: boolean
      compactView?: boolean
      sequence?: string
    } = {}
  ) {
    const initialSequence = config.sequence || ''
    delete config.sequence

    Object.assign(this, config)

    const slotw = Math.floor(this.width / 7),
      dslotw = Math.floor(slotw / 2),
      sloth = Math.floor(this.height / 7),
      dsloth = Math.floor(sloth / 2)

    this.spotRadius = Math.floor(0.35 * Math.min(slotw, sloth))

    this.slots.forEach((slot, si) => {
      const slotValidMoves = this.validMoves.filter((m) => si == m[0])
      slot.setup(slotw, sloth, dslotw, dsloth, slotValidMoves)
    })

    this.view = this.createView()
    this.runSequence(initialSequence)
  }

  centralHole = this.slots[16]

  get score(): number {
    return 32 - this.sequence.length //TOOD: 32-magic-number
  }

  /**
   * Determines the possible moves available in the current board state
   */
  get possibleMoves(): MoveT[] {
    return this.slots.map((spot) => spot.possibleMoves(this.slots)).flat()
  }

  get possibleMovesIndexes(): string[] {
    return this.possibleMoves.map((m) => m[3])
  }

  /**
   * @param m     is a validMove
   * @param spot  is the destination spot
   * */
  runMove(m: MoveT) {
    const [from, mid, to, id] = m
    const slotFrom = this.slots[from]
    const slotMid = this.slots[mid]
    const slotTo = this.slots[to]
    const moveIndex = parseInt(id)
    if (slotFrom.possibleMoves(this.slots).includes(m)) {
      slotTo.setPeg()
      slotMid.setEmpty()
      slotFrom.setEmpty()
      this.sequence.push(moveIndex)
      return true
    } else {
      console.log('Este movimento não pode ser executado agora. ', m.toString())
      return false
    }
  }

  cleanState() {
    this.slots.forEach((spot) => spot.cleanState())
  }

  selectSpot(spot: BoardSlot) {
    spot.select()
    spot.possibleMoves(this.slots).forEach((m) => this.slots[m[2]].setDestination(m))
  }

  runSequence(seq: string) {
    new Sequence(seq).forEach((mi) => {
      const m = this.validMoves[parseInt(mi)]
      this.runMove(m)
    })

    this.updateView()
  }

  runSequenceAnimated(seq: string) {
    new Sequence(seq).forEach((mi, i) => {
      setTimeout(() => {
        const m = this.validMoves[parseInt(mi)]
        this.runMove(m)
        this.updateView()
      }, 500 * i)
    })
  }

  undoLastMove() {
    if (this.sequence.length > 0) {
      const [from, mid, to] = this.validMoves[this.sequence.pop()]
      this.slots[to].state = 'empty'
      this.slots[mid].state = ''
      this.slots[from].state = ''
      this.updateView()
    }
  }

  reset() {
    this.slots.forEach((slot) => slot.reset())
    this.sequence = new Sequence()
    this.updateView()
  }

  clickSpotHandler(spot: BoardSlot) {
    if (spot.destination()) {
      //run movement and remove one peg
      if (spot.refMove) {
        this.runMove(spot.refMove)
        this.cleanState()
        this.updateView()
      }
    } else if (spot.empty()) {
      //nothing to do
    } else {
      //select peg
      this.cleanState()
      this.selectSpot(spot)
      this.updateView()
    }
  }

  createView() {
    if (this.noView) {
      return
    }

    const svg = d3
      .select(this.container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)

    const g = svg
      .selectAll('g.node')
      .data(this.slots)
      .enter()
      .append('svg:g')
      .attr('class', 'node')
      .attr('transform', function (d: any) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
      .on('click', this.clickSpotHandler.bind(this))

    g.append('svg:circle')
      .attr('class', (spot: any) => spot.state)
      .attr('r', this.spotRadius)

    if (this.compactView) {
      svg
        .append('svg:text')
        .attr('x', this.width - 21)
        .attr('y', this.height - 10)
        .attr('class', 'score')
        .text(() => this.score.toString())
    } else {
      g.append('svg:text')
        .attr('x', '-0.5em')
        .attr('dy', '.31em')
        .text((_d: any, i: number) => `${i.toString()}`.padStart(2, '0'))

      svg
        .append('svg:text')
        .attr('x', this.width - 100)
        .attr('y', this.height - 30 + 'px')
        .attr('class', 'score')
        .text(() => `Remaining ${this.score}`)

      svg
        .append('svg:text')
        .attr('x', 30)
        .attr('y', this.height - 30 + 'px')
        .attr('class', 'solucoes')
        .text(() => '')

      svg
        .append('svg:text')
        .attr('x', this.width - 100)
        .attr('y', 30 + 'px')
        .attr('class', 'resetButton')
        .text('Reset')
        .on('click', () => this.reset())
    }

    return svg
  }

  updateView() {
    if (this.noView) {
      return
    }

    this.view
      .selectAll('circle')
      .data(this.slots)
      .attr('class', (d: any) => d.state)

    if (this.compactView) {
      this.view.select('.score').text(() => this.score.toString())
    } else {
      this.view.select('.score').text(() => 'Remaining ' + this.score)

      if (this.score == 1) {
        this.view.select('.solucoes').text('well done!')
      } else if (this.score < 13) {
        this.findSolutions()
      } else {
        if (this.solutionFinderWorker) {
          this.solutionFinderWorker.terminate()
        }
        this.view.select('.solucoes').text('')
      }
    }
  }

  findSolutions() {
    if (this.solutionFinderWorker) {
      this.solutionFinderWorker.terminate()
    }

    const worker = new Worker('js/src/BuscaWebWorker.js', { type: 'module' })

    worker.addEventListener(
      'message',
      (e) => {
        if (e.data.solucoes) {
          this.view
            .select('.solucoes')
            .text(`There are ${e.data.solucoes.length} possible solutions`)
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

    worker.postMessage({ sequenciaInicial: this.sequence.toString(), noCentro: true })

    this.solutionFinderWorker = worker
  }
}

class Sequence extends Array {
  constructor(seq = '') {
    super()
    ;(seq.match(/.{2}/g) || []).forEach((mi) => this.push(mi))
  }

  toString() {
    return [...this].map((mi) => `${mi.toString()}`.padStart(2, '0')).join('')
  }
}

export default Board
