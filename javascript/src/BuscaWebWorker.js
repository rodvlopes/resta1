importScripts('../lib/jquery/jquery.hive.pollen.js', '../lib/underscore.js');
importScripts('Resta1.js', 'Busca.js');

var e;
    
function iniciarBusca(sequenciaIncial) {
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
			return board.score() == 1;
		},
		movimentos: function() {
			return board.validMovesIndexNow();
		}
	});
	var solucoes = busca.solucoes();
	
	self.postMessage({solucoes: solucoes});
}



self.addEventListener('message', function(e) {
    if (e.data == 'inicia') {
        self.postMessage('buscando...');
        iniciarBusca();
    }
}, false);