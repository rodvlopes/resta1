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