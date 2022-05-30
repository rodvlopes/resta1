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

class BoardSlot {
  constructor({ x, y }, id) {
    this.x = x
    this.y = y
    this.id = id
    this.state = id == 16 ? 'empty' : '' //TODO: assign 16-magic-number a name //State: ''|'empty'|'destination'|'selected'
    this.validMoves = []
    this.refMove = null
  }

  setup(slotw, sloth, dslotw, dsloth, validMoves) {
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

  possibleMoves(boardSlots) {
    return this.validMoves.filter(
      ([from, mid, to]) =>
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

  setDestination(move) {
    this.state = 'destination'
    this.refMove = move
  }
}

var PegSolitaire = {
  Board: function (userConfig) {
    const config = Object.assign(
      {
        width: 400,
        height: 300,
        container: 'body',
        noView: false,
        compactView: false,
        // prettier-ignore
        boardSlots: [
                                      {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0},
                                      {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1},
          {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2},
          {x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 6, y: 3},
          {x: 0, y: 4}, {x: 1, y: 4}, {x: 2, y: 4}, {x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 6, y: 4},
                                      {x: 2, y: 5}, {x: 3, y: 5}, {x: 4, y: 5},
                                      {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6},
        ].map((pos, i) => new BoardSlot(pos, i)),
        // prettier-ignore
        // one validMove is [from, middle, to, id]
        validMoves: [
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
          ].map((m, mi) => [...m, `${mi}`.padStart(2, '0')]), //add forth element: index as string
      },
      userConfig
    )
    //TODO: verificar se o quarto argumento está sendo usado

    const width = config.width,
      height = config.height,
      slotw = Math.floor(width / 7),
      dslotw = Math.floor(slotw / 2),
      sloth = Math.floor(height / 7),
      dsloth = Math.floor(sloth / 2),
      radius = Math.floor(0.35 * Math.min(slotw, sloth))

    board = {
      slots: config.boardSlots,
      validMoves: config.validMoves,
    }

    //Determines the possible movements available on the current board state
    board.possibleMoves = function () {
      return board.slots.map((spot) => spot.possibleMoves(board.slots))
    }

    board.validMovesIndexNow = function () {
      return board.possibleMoves().map((m) => m[3])
    }

    /**
     * @param m     is a validMove
     * @param spot  is the destination spot
     * */
    board.runMove = function (m, spotTo) {
      //TODO: eliminate spotTo
      const [from, mid, to, id] = m
      const slotFrom = board.slots[from]
      const slotMid = board.slots[mid]
      const slotTo = board.slots[to]
      var moveIndex = parseInt(id)
      if (slotFrom.possibleMoves(board.slots).includes(m)) {
        slotTo.setPeg()
        slotMid.setEmpty()
        slotFrom.setEmpty()
        board.sequence.push(moveIndex)
        return true
      } else {
        console.log('Este movimento não pode ser executado agora. ', m.toString())
        return false
      }
    }

    board.slots.forEach((slot, si) => {
      const slotValidMoves = board.validMoves.filter((m) => si == m[0])
      slot.setup(slotw, sloth, dslotw, dsloth, slotValidMoves)
    })

    board.sequence = new PegSolitaire.Sequence()

    board.score = function () {
      return 32 - board.sequence.length //TOOD: 32-magic-number
    }

    board.cleanState = function () {
      board.slots.forEach((spot) => spot.cleanState())
    }

    board.selectedSpot = function () {
      return board.slots.find((slot) => slot.selected())
    }

    board.selectSpot = function (spot) {
      spot.select()
      spot.possibleMoves(board.slots).forEach((m) => board.slots[m[2]].setDestination(m))
    }

    board.getMoveByIndex = function (i) {
      const m = board.validMoves[parseInt(mi)]
      const spot = board.slots[m[2]]
      return [m, spot]
    }

    board.runSequence = function (seqStr) {
      new PegSolitaire.Sequence(seqStr).forEach((mi) => {
        const [m, spot] = board.getMoveByIndex(mi)
        board.runMove(m, spot)
      })

      updateView()
    }

    board.runSequenceAnimated = function (seqStr) {
      new PegSolitaire.Sequence(seqStr).forEach((mi, i) => {
        setTimeout(function () {
          const [m, spot] = board.getMoveByIndex(mi)
          board.runMove(m, spot)
          updateView()
        }, 500 * i)
      })
    }

    board.undoLastMove = function () {
      if (board.sequence.length > 0) {
        const [from, mid, to] = board.validMoves[board.sequence.pop()]
        board.slots[to].state = 'empty'
        board.slots[mid].state = ''
        board.slots[from].state = ''
        updateView()
      }
    }

    board.reset = function () {
      board.slots.forEach((slot) => slot.reset())
      board.sequence = new PegSolitaire.Sequence()
      updateView()
    }

    var view = (function createView() {
      if (config.noView) return

      var svg = d3
        .select(config.container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      var g = svg
        .selectAll('g.node')
        .data(board.slots)
        .enter()
        .append('svg:g')
        .attr('class', 'node')
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
        .on('click', function (spot) {
          if (spot.destination()) {
            //run movement and remove one peg
            board.runMove(spot.refMove, spot)
            board.cleanState()
            updateView()
          } else if (spot.empty()) {
            //nothing to do
          } else {
            //select peg
            board.cleanState()
            board.selectSpot(spot)
            updateView()
          }
        })

      g.append('svg:circle')
        .attr('class', (spot) => spot.state)
        .attr('r', radius)

      if (config.compactView) {
        svg
          .append('svg:text')
          .attr('x', width - 21)
          .attr('y', height - 10)
          .attr('class', 'score')
          .text(() => board.score().toString())
      } else {
        g.append('svg:text')
          .attr('x', '-0.5em')
          .attr('dy', '.31em')
          .text((d, i) => (i.toString().length == 1 ? '0' + i : i))

        svg
          .append('svg:text')
          .attr('x', width - 100)
          .attr('y', height - 30 + 'px')
          .attr('class', 'score')
          .text(() => 'Remaining ' + board.score())

        svg
          .append('svg:text')
          .attr('x', 30)
          .attr('y', height - 30 + 'px')
          .attr('class', 'solucoes')
          .text(() => '')

        svg
          .append('svg:text')
          .attr('x', width - 100)
          .attr('y', 30 + 'px')
          .attr('class', 'resetButton')
          .text('Reset')
          .on('click', () => board.reset())
      }

      return svg
    })()

    function updateView() {
      if (config.noView) return

      view
        .selectAll('circle')
        .data(board)
        .attr('class', (d) => d.state)

      if (config.compactView) {
        view.select('.score').text(() => board.score().toString())
      } else {
        view.select('.score').text(() => 'Remaining ' + board.score())

        if (board.score() == 1) view.select('.solucoes').text('well done!')
        else if (board.score() < 13) {
          board.findSolutions(board.sequence.toString(), (solutions) => {
            view.select('.solucoes').text(`There are ${solutions.length} possible solutions`)
            console.log(solutions)
          })
        } else {
          if (board.workerBusca) {
            board.workerBusca.terminate()
          }
          view.select('.solucoes').text('')
        }
      }
    }

    board.findSolutions = function (sequencia, handleSolucoes) {
      if (board.workerBusca) board.workerBusca.terminate()

      board.workerBusca = new Worker('js/src/BuscaWebWorker.js')

      board.workerBusca.addEventListener(
        'message',
        function (e) {
          if (e.data.solucoes) handleSolucoes(e.data.solucoes)
          else console.log(e.data)
        },
        false
      )

      board.workerBusca.onerror = function (event) {
        console.error(event)
      }

      board.workerBusca.postMessage({ sequenciaInicial: sequencia, noCentro: true })
    }

    board.runSequence(config.sequence)

    return board
  },

  Sequence: function (seqStr) {
    if (typeof seqStr == 'string') {
      var seqArr = seqStr.match(/.{2}/g)
      for (var i = 0; i < seqArr.length; this.push(seqArr[i++]));
    }

    this.toString = function () {
      return this.map((mi) => `${mi.toString()}`.padStart(2, '0')).join('')
    }
  },
}

PegSolitaire.Sequence.prototype = new Array()
