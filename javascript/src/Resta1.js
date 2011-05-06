var Resta1 = {

	/*#################################################*/
	/*############        MOVIMENTO         ##########*/
	
	Movimento : function (movimentoArray) {
		this.de 	= movimentoArray[0];
		this.meio = movimentoArray[1];
		this.para = movimentoArray[2];
		
		this.equals = function(de, para) {
			if (typeof(de) == 'object') {
				var m=de;
				return this.de == m[0] && this.meio == m[1] && this.para == m[2];
			}
			return this.de == de && this.para == para;
		}
		
		this.toArray = function() {
			return [this.de, this.meio, this.para];
		}
		
		this.toString = function() {
			return '['+this.de+','+this.meio+','+this.para+']';
		}
	},


	/*##################################################*/
	/*############        MOVIMENTOS         ##########*/
	
	Movimentos : function (params) {
		var self = this;
		self._movimentos = [];
		
		function init() {
			
			if (params['movimentos']) {
				self.inicializarMovimentos(params['movimentos']);
			}
			else if (params['json']) {
				$.getJSON(params['json'], self.inicializarMovimentos);
			}
			
		}
		
		this.inicializarMovimentos = function(lista) {
			for(var i=0; i<lista.length; i++) {
				self._movimentos.push(new Resta1.Movimento(lista[i]));
			}
		}

		this.ehValido = function(de, para) {
			for (var i=0; i<this._movimentos.length; i++) {
				var m = this._movimentos[i];
				if (m.equals(de,para)) { return m; }
			}
			return false;
		}
		
		init();
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
			self._pecaSnippet = '<div class="peca ui-draggable" style="position: relative; display: none;"></div>';
			
			self._id = params['id'];
			self._$tabuleiro = $("#"+self._id);
			if (self._$tabuleiro.length != 1) Notification.error('Tabuleiro não encontrado!');
		
			self._movimentos = params['movimentos'];
			if (!self._movimentos) Notification.error('Tabuleiro precisa regras de movimento para funcionar!');
		
			if (params['contadorId']) {
				self._contador = params['contadorId'];
				self._$contador = $("#"+self._contador);
				$(self).bind('totalDePecasAlterado', function(event, novoValor) {
					console.log(novoValor);
					self._$contador.text(novoValor);
				});
			}
	
			if (params['listaMovimentosId']) {
				self._listaMovimentosId = params['listaMovimentosId'];
				$("#"+self._listaMovimentosId).append('<ul></ul>');
				self._$listaMovimentos = $("#"+self._listaMovimentosId+" ul");
				$(self).bind('pecaComida', self.listaMovimentosAdicionar);
				$(self).bind('jogoReiniciado', function() {self._$listaMovimentos.html('');});
				self._$listaMovimentos.find('li').live('mouseover', function(){
					$(this).addClass('para-remover');
					self._$listaMovimentos.find('li:gt('+$(this).index()+')').addClass('para-remover');
				});
				self._$listaMovimentos.find('li').live('click', self.desfazerMovimentosSelecionados);
				self._$listaMovimentos.bind('mouseout', function(){
					$(this).find('li').removeClass('para-remover');
				});
			}
			
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
		
		this.executar = function(movimento, $elemDragged, $elemDrop, posAcao) {
			self._$tabuleiro.find('td[data-spot="'+movimento.meio+'"]').children()
				.fadeOut(function(){
					$(this).remove();
					self.eventos.emitirPecaComida(movimento);
					if (typeof(posAcao) == 'function') { posAcao(); }
				});
			
			$elemDrop.append($elemDragged.css('top','0').css('left', '0'));
		};
		
		this.reverter = function(movimento, posAcao) {
			self._$tabuleiro.find('td[data-spot="'+movimento.de+'"]').html(self._pecaSnippet);
			self._$tabuleiro.find('td[data-spot="'+movimento.de+'"]').find('.peca').fadeIn('fast');
			
			self._$tabuleiro.find('td[data-spot="'+movimento.meio+'"]').html(self._pecaSnippet);
			self._$tabuleiro.find('td[data-spot="'+movimento.meio+'"]').find('.peca').fadeIn('fast');
			
			self._$tabuleiro.find('td[data-spot="'+movimento.para+'"]').find('.peca').fadeOut('fast', function() {
				self._$tabuleiro.find('td[data-spot="'+movimento.para+'"]').html('');
				console.log('emirit');
				self.eventos.emitirMovimentoRevertido(movimento);
				if (typeof(posAcao) == 'function') { posAcao(); }
			}); 
		};
		
		this.movimentoPossivelNoEstadoAtual = function (de, para) {
			var movimento = (typeof(de) == "object") ? de : self._movimentos.ehValido(de, para);
			console.log("MV POS? " + movimento);
			if (!movimento) return false;
			
			console.log(self._$tabuleiro.html());
			console.log(self._$tabuleiro.find('td[data-spot="'+movimento.meio+'"]').children());
			console.log(self._$tabuleiro.find('td[data-spot="'+movimento.para+'"]').children());
			return 	self._$tabuleiro.find('td[data-spot="'+movimento.meio+'"]').children().length >  0 &&
							self._$tabuleiro.find('td[data-spot="'+movimento.para+'"]').children().length == 0;
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
			self.eventos.emitirJogoReiniciado();
		};
		
		this.listaMovimentosAdicionar = function(event, movimento) {
				self._$listaMovimentos.append('<li>'+movimento.de+'>'+movimento.para+'</li>');
		};
		
		this.desfazerMovimentosSelecionados = function() {
			var movimentosParaDesfazer = self._$listaMovimentos.find('.para-remover').get();
			
			console.log('enrtei');
			console.log(movimentosParaDesfazer);
			
			(function defazerRecusivo() {
				if (movimentosParaDesfazer.length == 0) {
					self.tornarPecasDraggables();
					return;
				}
				var $li = $(movimentosParaDesfazer.pop());
				$li.remove();
				var mSplit = $li.html().split('&gt;');
				var movimento = self._movimentos.ehValido(mSplit[0],mSplit[1]);
				console.log(movimento);
				self.reverter(movimento, defazerRecusivo);
			})();
		};
		
		this.executarMovimentos = function(movimentosStr) {
			if ($.trim(movimentosStr).length == 0) return;
			
			var movimentosStrArr = $.trim(movimentosStr).split(/\s+/);
			var movimentosParaExecutar = [];
			for (var i=0; i< movimentosStrArr.length; i++) {
				var mSplit = movimentosStrArr[i].split('>');
				var movimento = self._movimentos.ehValido(mSplit[0], mSplit[1]);
				if (movimento) {
					movimentosParaExecutar.push(movimento);
				}
				else {
					Notification.error("Esta sequência de movimentos não é válida. Movimento incorreto encontrado: #m.".replace("#m",mSplit[0]+'>'+mSplit[1]), "Erro");
					return;
				}
			}
			movimentosParaExecutar = movimentosParaExecutar.reverse();
			
			(function executarRecusivo() {
				if (movimentosParaExecutar.length == 0) {
					return;
				}
				
				var movimento = movimentosParaExecutar.pop();
				
				if (!self.movimentoPossivelNoEstadoAtual(movimento)) {
					Notification.error("O movimento #m não pode ser executado no estado atual.".replace("#m",movimento.de+'>'+movimento.para), "Erro");
					return;
				}
				
				$elemDragged = $('td[data-spot="'+movimento.de+'"]').children();
				$elemDrop    = $('td[data-spot="'+movimento.para+'"]');
				self.executar(movimento, $elemDragged, $elemDrop, executarRecusivo);
			})();
		};
		
		
		// *** EVENTOS *** //
		this.eventos = {
			emitirTotalDePecasAlterado : function() {
				var totalPecas = self._$tabuleiro.find('.peca').length;
				$(self).trigger('totalDePecasAlterado', [totalPecas]);
			},
			
			emitirPecaComida : function(movimento) {
				$(self).trigger('pecaComida', [movimento]);
				
				self.eventos.emitirTotalDePecasAlterado();
			},
			
			emitirJogoReiniciado : function() {
					$(self).trigger('jogoReiniciado');
					
					self.eventos.emitirTotalDePecasAlterado();
			},
			
			emitirMovimentoRevertido : function(movimento) {
				$(self).trigger('movimentoRevertido', [movimento]);
				
				self.eventos.emitirTotalDePecasAlterado();
			}
		};
		
		self._inicializar();
		
	}//Tabuleiro
	
}
