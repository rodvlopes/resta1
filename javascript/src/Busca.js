function Busca(config){
    var _this = this;
	
	$.extend(this, config);
	
	_this.solucoes = function(tipoBusca) {
        
        _this.solucoesEncontradas = [];
		return _this.buscar(_this.movimentos(), _this.sequenciaInicial);
		
	}
	
	_this.buscar = function(movimentos, sequenciaInicial) {
		
		while (movimentos.length > 0) {
			var m = movimentos.pop();
            var s = sequenciaInicial+m;
			if (_this.objetivo(s))
				_this.solucoesEncontradas.push(s);
			else
				_this.buscar(_this.movimentos(), s);
		}
		
		return _this.solucoesEncontradas;
	}
}


(function testes() {
	console.log('Inciando os testes...');
	
    /*
        012 -> 0123 -> 01233
                    -> 01234 *
            -> 0125 *
            -> 0121
                    -> 01211
                    -> 01214
                    -> 01215 *
            -> 0122
        
        largura:        0125, 01234, 01215
        profundidade:   01234, 0125, 01215
    */
    
	//stub do board
	var Resta1Stub = {
		Board : function(config) {
			this.sequencia = config.sequencia;
			
			this.score = function() {
				if (this.sequencia == '01234') return 1;
				if (this.sequencia == '0125' ) return 1;
				if (this.sequencia == '01215') return 1;
				return 0;
			}
			
			this.validMovesNow = function() {
				if (this.sequencia == '012')  return [3,5,1,2];
				if (this.sequencia == '0123') return [3,4];
				if (this.sequencia == '0125') return [];
				if (this.sequencia == '0121') return [1,4,5];
				if (this.sequencia.charAt( this.sequencia.length-1 ) == '6') return [];
				return [6];
			}
			
			this.runSequence = function(s) {
				this.sequencia = s;
			}
            
            this.reset = function() {
                //do nothing
            }
		}
	}
	
	
	var board = new Resta1Stub.Board({sequencia: '012'});
	var busca = new Busca({
        sequenciaInicial: '012',
		sequencia: function() {
			return board.sequence.toString();
		},
		objetivo: function(sequencia) {
            board.reset(); 
            board.runSequence(sequencia);
			return board.score() == 1;
		},
		movimentos: function() {
			return board.validMovesNow();
		}
	});
	var solucoes = busca.solucoes();
	
	console.assert(solucoes[0] == '01215');
	console.assert(solucoes[1] == '0125' );
	console.assert(solucoes[2] == '01234');
    console.log('Testes finalizados.')
	
})();


(function testesIntegracao() {
    console.log('Inciando os testes de integraçao...');
    
    var sequenciaIncial = "3166707175370635475530103271494365562965010916400269044436";
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
	
	console.assert(solucoes[0] == "31667071753706354755301032714943655629650109164002690444362618");
	console.assert(solucoes[1] == '31667071753706354755301032714943655629650109164002690444362607');
    console.log('Testes integraçao finalizados.')

})();