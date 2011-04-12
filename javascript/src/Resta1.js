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
	//
	//params {
	//  id 						: id da tabela que representa o tabuleiro do jogo.
	//	movimentos 		: instância de Movimentos.
	//	contadorId  	: [opcional] id do elemento que vai receber
	//                	o evento totalDePecasAlterado.
	//	listaMovimentosId : Id do elemento onde será adicionado a lista 
	//											de movimentações que foram executadas.
	//}
	Tabuleiro : function(params) {
		var self = this;
		
		
		//Inicializar
		this._inicializar = function() {
			self._pecaSnippet = '<div class="peca ui-draggable" style="position: relative;"></div>';
			
			self._id = params['id'];
			self._$tabuleiro = $("#"+self._id);
			if (self._$tabuleiro.length != 1) console.log('Erro: Tabuleiro não encontrado!');
		
			self._movimentos = params['movimentos'];
			if (!self._movimentos) console.log('Erro: Tabuleiro precisa regras de movimento para funcionar!');
		
			self._contador = 'contador';
			if (params['contadorId']) self._contador = params['contadorId'];
			self._$contador = $("#"+self._contador);
	
			self._estadoInicial = [];
			self._$tabuleiro.find('.peca').each(function(){ 
				var spot = $(this).parent().get(0).getAttribute('data-spot');
				self._estadoInicial.push(spot) ;
			});
			
			if (params['listaMovimentosId']) {
				self._listaMovimentosId = params['listaMovimentosId'];
				$("#"+self._listaMovimentosId).append('<ul></ul>');
				self._$listaMovimentos = $("#"+self._listaMovimentosId+" ul");
				self._$listaMovimentos.bind('totalDePecasAlterado', self.listaMovimentosAdicionar);
				self._$listaMovimentos.find('li').live('mouseover', function(){
					$(this).addClass('para-remover');
					self._$listaMovimentos.find('li:gt('+$(this).index()+')').addClass('para-remover');
				});
				self._$listaMovimentos.find('li').live('click', self.desfazerMovimentosSelecionados);
				self._$listaMovimentos.bind('mouseout', function(){
					$(this).find('li').removeClass('para-remover');
				});
			}
			
		
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
					self.emitirTotalDePecasAlterado(movimento);
				});
			
			$elemDrop.append($elemDragged.css('top','0').css('left', '0'));
		};
		
		this.reverter = function(movimento) {
			self._$tabuleiro.find('td[data-spot="'+movimento[1]+'"]').append(self._pecaSnippet);
			self._$tabuleiro.find('td[data-spot="'+movimento[0]+'"]').append(
				self._$tabuleiro.find('td[data-spot="'+movimento[2]+'"]').children()
			);
		};
		
		this.emitirTotalDePecasAlterado = function(movimento) {
			var totalPecas = self._$tabuleiro.find('.peca').length;
			self._$contador.trigger('totalDePecasAlterado', [totalPecas, movimento]);
			
			if (self._listaMovimentosId)
				self._$listaMovimentos.trigger('totalDePecasAlterado', [totalPecas, movimento]);
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
			self.emitirTotalDePecasAlterado(null);
		};
		
		this.listaMovimentosAdicionar = function(event, total, movimento) {
			//refatorar
			if (movimento)
				self._$listaMovimentos.append('<li>'+movimento[0]+'>'+movimento[2]+'</li>');
			else
				self._$listaMovimentos.html('');
		};
		
		this.desfazerMovimentosSelecionados = function() {
			var movimentosParaDesfazer = $(self._$listaMovimentos.find('.para-remover').get().reverse());
			movimentosParaDesfazer.each(function(){
				var mSplit = this.innerHTML.split('&gt;');
				var movimento = self._movimentos.ehValido(mSplit[0],mSplit[1]);
				self.reverter(movimento);
				$(this).remove();
			});
			
			self.emitirTotalDePecasAlterado(null);
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