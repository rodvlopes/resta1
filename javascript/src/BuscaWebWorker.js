importScripts('../lib/jquery/jquery.hive.pollen.js', '../lib/underscore.js');
importScripts('Resta1.js', 'Busca.js');

function iniciarBusca(sequenciaIncial, noCentro) {
    var board = new Resta1.Board({noView:true});
    board.runSequence(sequenciaIncial);
    
    var busca = new Busca({
        sequenciaInicial: sequenciaIncial,
		sequencia: function() {
			return board.sequence.toString();
		},
		objetivo: function(sequencia) {
            board.reset(); 
            board.runSequence(sequencia);
			if (noCentro)
				return !board[16].empty() && board.score() == 1;
			return board.score() == 1;
		},
		movimentos: function() {
			return board.validMovesIndexNow();
		}
	});
	var solucoes = busca.solucoes(1);
	
	self.postMessage({solucoes: solucoes});
	self.close();
}



self.addEventListener('message', function(e) {
    if (e.data.sequenciaInicial) {
        self.postMessage('buscando...');
        iniciarBusca(e.data.sequenciaInicial, e.data.noCentro);
    }
}, false);