var Busca = function(config){
	var _this = this;
	
	$.extend(this, config);
	
	_this.solucoes = function(tipoBusca) {

		if (tipoBusca == 'largura') {
			return _this.buscar(_this.movimentos());
		}
	}
	
	_this.buscar = function(movimentos) {
		var solucoes = [];
		
		while (movimentos.length > 0) {
			var m = movimentos.pop();
			_this.executarMovimento(m);
			if (_this.objetivo())
				solucoes.push(_this.sequencia());
			else
				solucoes.concat(_this.buscar(_this.movimentos()));
		}
		
		return solucoes;
	}
}


(function testes() {
	console.log('Inciando os testes...');
	
	//stub do board
	var Resta1Stub = {
		Board : function(config) {
			this.sequencia = config.sequencia;
			
			this.score = function() {
				if (this.sequencia == '01234') return 1;
				if (this.sequencia == '01254') return 1;
				if (this.sequencia == '01215') return 1;
				return 0;
			}
			
			this.validMovesNow = function() {
				if (this.sequencia == '012')  return [3,5,1,2];
				if (this.sequencia == '0123') return [3,4];
				if (this.sequencia == '0125') return [1,4];
				if (this.sequencia == '0121') return [1,4,5];
				if (this.sequencia.charAt( this.sequencia.length-1 ) == '6') return [];
				return [6];
			}
			
			this.runMove = function(m) {
				this.sequencia += m;
			}
		}
	}
	
	
	var board = new Resta1Stub.Board({sequencia: '012'});
	var busca = new Busca({
		sequencia: function() {
			return board.sequence.toString();
		},
		objetivo: function() {
			return board.score() == 1;
		},
		movimentos: function() {
			return board.validMovesNow();
		},
		executarMovimento: function(m) {
			board.runMove(m);
		}
	});
	var solucoes = busca.solucoes('largura');
	
	console.assert(solucoes[0] == '01234');
	console.assert(solucoes[0] == '01254');
	console.assert(solucoes[0] == '01215');
	
	

	
})();