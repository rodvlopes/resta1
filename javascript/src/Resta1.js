var Resta1 = {

	/*##################################################*/
	/*############        MOVIMENTOS         ##########*/
	
	Movimentos : function (params) {
		if (params['movimentos']) {
			this._movimentos = params['movimentos'];
		}
		else if (params['json']) {
			var self = this;
			$.getJSON(params['json'], function(listaMovimentos){
				self._movimentos = listaMovimentos;
			})
		}
		else {
			this._movimentos = [];
		}
		

		this.ehValido = function(de, para) {
			for (var i in this._movimentos) {
				var m = this._movimentos[i];
				if (m[0]==de && m[2]==para) { return m; }
			}
			return false;
		}
	},
	
	
	/*##################################################*/
	/*############         TABULEIRO          ##########*/
	
	Tabuleiro : function(params) {
		var self = this;
		
		
		//Inicializar
		this._inicializar = function() {
			self._id = params['id'];
			self._$tabuleiro = $("#"+self._id);
			if (self._$tabuleiro.length != 1) console.log('Erro: Tabuleiro não encontrado!');
		
			self._movimentos = params['movimentos'];
			if (!self._movimentos) console.log('Erro: Tabuleiro precisa regras de movimento para funcionar!');
		
			self._contador = 'contador';
			if (params['contador']) self._contador = params['contador'];
			self._$contador = $("#"+self._contador);
	
			self._estadoInicial = [];
			self._$tabuleiro.find('.peca').each(function(){ 
				var spot = $(this).parent().get(0).getAttribute('data-spot');
				self._estadoInicial.push(spot) ;
			});
		
			self.tornarPecasDraggables();
			self.tonarSpotsDroppables();
		};		
				
	
		//Métodos
		this.tornarPecasDraggables = function() {
			self._$tabuleiro.find(".peca").draggable({
			   revert: 'invalid'
			});
		};
		
		this.tonarSpotsDroppables = function() {
			self._$tabuleiro.find(".spot").droppable({
				accept: function(elemento) {
					var paraSpot = this.getAttribute('data-spot');
					var deSpot   = elemento.parent().get(0).getAttribute('data-spot');
					return self.movimentoPossivelNoEstadoAtual(deSpot, paraSpot);
		    },
				activate: function(event, ui) {
					var paraSpot = this.getAttribute('data-spot');
					var deSpot   = ui.draggable.parent().get(0).getAttribute('data-spot');
					if (self._movimentos.ehValido(deSpot, paraSpot)) {
						self._$tabuleiro.find('td[data-spot="'+paraSpot+'"]').addClass('highlight');
					}			
				},
				deactivate: function() {
					self._$tabuleiro.find('td').removeClass('highlight');
				},
				drop: function(event, ui) {
					var paraSpot = this.getAttribute('data-spot');
					var deSpot   = ui.draggable.parent().get(0).getAttribute('data-spot');
					var movimento = self._movimentos.ehValido(deSpot, paraSpot);
					self.executar(movimento, ui.draggable, $(this));
					self._$tabuleiro.find('td').removeClass('highlight');
				}
			});
		};
		
		this.executar = function(movimento, $elemDragged, $elemDrop) {
			var meioSpot = movimento[1]
			self._$tabuleiro.find('td[data-spot="'+meioSpot+'"]').children()
				.fadeOut(function(){
					$(this).remove();
					self.emitirTotalDePecasAlterado();
				});
				
			$elemDrop.append($elemDragged.css('top','0').css('left', '0'));
		};
		
		this.emitirTotalDePecasAlterado = function() {
			var totalPecas = self._$tabuleiro.find('.peca').length;
			self._$contador.trigger('totalDePecasAlterado', [totalPecas]);
		};
		
		this.movimentoPossivelNoEstadoAtual = function (de, para) {
			var movimento = self._movimentos.ehValido(de, para)
			if (!movimento) return false;
			
			var meioSpot = movimento[1];
			var paraSpot = movimento[2];
			return 	self._$tabuleiro.find('td[data-spot="'+meioSpot+'"]').children().length >  0 &&
							self._$tabuleiro.find('td[data-spot="'+paraSpot+'"]').children().length == 0;
		};
		
		this.reiniciar = function() {
			
			self._$tabuleiro.find('.spot').each(function(){
				var spot = this.getAttribute('data-spot');
				if (self._estadoInicial.contains(spot)) {
					$(this).html('<div class="peca" />');
				}
				else {
					$(this).html('');
				}
			});
			
			self.tornarPecasDraggables();
			self.emitirTotalDePecasAlterado();
		};
		
		self._inicializar();
		
	}//Tabuleiro
	
}




//UTILS

Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}