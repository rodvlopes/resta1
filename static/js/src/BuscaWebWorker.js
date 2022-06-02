import Board from '../tsbuild/PegSolitaire'
// importScripts('../lib/jquery/jquery.hive.pollen.js', '../lib/underscore.js')
// importScripts('../tsbuild/PegSolitaire.js', 'Busca.js')

function iniciarBusca(sequenciaIncial, noCentro, numSolucoes) {
  var board = new Board({ noView: true })
  board.runSequence(sequenciaIncial)

  var busca = new Busca({
    sequenciaInicial: sequenciaIncial,
    sequencia: function () {
      return board.sequence.toString()
    },
    objetivo: function (sequencia) {
      board.reset()
      board.runSequence(sequencia)
      if (noCentro) return !board.centralHole.empty() && board.score() == 1
      return board.score() == 1
    },
    movimentos: function () {
      return board.possibleMovesIndexes
    },
  })
  var solucoes = busca.solucoes(numSolucoes)

  self.postMessage({ solucoes: solucoes })
  self.close()
}

self.addEventListener(
  'message',
  function (e) {
    if (e.data.sequenciaInicial) {
      self.postMessage('buscando...')
      iniciarBusca(e.data.sequenciaInicial, e.data.noCentro, e.data.numSolucoes)
    }
  },
  false
)
