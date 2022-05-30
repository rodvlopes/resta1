function Busca(config){
    var _this = this;
	
	$.extend(this, config);
	
	_this.solucoes = function(maxSolucoes) {
        
		if (typeof(maxSolucoes) != 'undefined') {
			_this.limitarNumSolucoes = true;
			_this.countSolucoes = maxSolucoes;
		}
		else
			_this.limitarNumSolucoes = false;
			
        _this.solucoesEncontradas = [];
		return _this.buscar(_this.movimentos(), _this.sequenciaInicial);
		
	}
	
	_this.buscar = function(movimentos, sequenciaInicial) {
		
		while (movimentos.length > 0) {
			if (_this.limitarNumSolucoes && _this.countSolucoes == 0) break;
			
			var m = movimentos.pop();
            var s = sequenciaInicial+m;
			if (_this.objetivo(s)) {
				if (_this.limitarNumSolucoes) _this.countSolucoes--;
				_this.solucoesEncontradas.push(s);
			}
			else
				_this.buscar(_this.movimentos(), s);
		}
		
		return _this.solucoesEncontradas;
	}
}