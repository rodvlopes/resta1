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
	//  id 								: id da tabela que representa o tabuleiro do jogo.
	//  appendTo 					: id do elemento ao qual será apendando um tabuleiro default.
	//	movimentos 				: instância de Movimentos.
	//	contadorId  			: [opcional] id do elemento que vai receber
	//                			o valor da pontuação do jogo.
	//	listaMovimentosId : Id do elemento onde será adicionado a lista 
	//											de movimentações que foram executadas.
	//	jogavel						: default true.
	//	execucaoInicial		: string de movimentos que será executada no momento da criaçao
	//											do tabuleiro.
	//	instantaneo				: default false. Se tem ou não animação nos movimentos.
	//}
	Tabuleiro : function(params) {
		var self = this;
		
		
		//Inicializar
		this._inicializar = function() {
			self._pecaSnippet = '<div class="peca ui-draggable" style="position: relative; display: none;"></div>';
			
			if (params['appendTo']) {
				var $div = (typeof(params['appendTo']) == "object") ? $(params['appendTo']) : $('#'+params['appendTo']);
				self._$tabuleiro = $div.append(Resta1.Tabuleiro.modeloDefault(params['tema'])).find('table');
			}
			else if (params['id']) {
				self._$tabuleiro = (typeof(params['id']) == "object") ? $(params['id']) : $("#"+params['id']);
			}
			else {
				Notification.error('Tabuleiro não encontrado!');
			}
			
			if (self._$tabuleiro.length != 1) Notification.error('Tabuleiro não encontrado!');
		
			self._movimentos = params['movimentos'];
			if (!self._movimentos) 
				self._movimentos = new Resta1.Movimentos({movimentos: Resta1.Tabuleiro.MovimentosDefault});
		
			if (params['contadorId']) {
				self._contador = params['contadorId'];
				self._$contador = $("#"+self._contador);
				$(self).bind('totalDePecasAlterado', function(event, novoValor) {
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
			
			self._jogavel = true;
			if (params['jogavel']==false) self._jogavel = false;
			
			self._instantaneo = false;
			if (params['instantaneo'] == true) self._instantaneo = true;
			self._animacaoTempo = self._instantaneo ? 0 : 'fast';
			
			self.execucaoInicial(params['execucaoInicial']);
			
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
			if (!self._jogavel) return;
			self._$tabuleiro.find(".peca").draggable({
			   revert: 'invalid'
			});
		};
		
		this.tonarSpotsDroppables = function() {
			if (!self._jogavel) return;
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
			$elemDrop.append($elemDragged.css('top','0').css('left', '0'));
			
			self._$tabuleiro.find('td[data-spot="'+movimento.meio+'"]').children()
				.fadeOut(self._animacaoTempo, function(){
					$(this).remove();
					self.eventos.emitirPecaComida(movimento);
					if (typeof(posAcao) == 'function') { posAcao(); }
				});
		};
		
		this.reverter = function(movimento, posAcao) {
			self._$tabuleiro.find('td[data-spot="'+movimento.de+'"]').html(self._pecaSnippet);
			self._$tabuleiro.find('td[data-spot="'+movimento.de+'"]').find('.peca').fadeIn(self._animacaoTempo);
			
			self._$tabuleiro.find('td[data-spot="'+movimento.meio+'"]').html(self._pecaSnippet);
			self._$tabuleiro.find('td[data-spot="'+movimento.meio+'"]').find('.peca').fadeIn(self._animacaoTempo);
			
			self._$tabuleiro.find('td[data-spot="'+movimento.para+'"]').find('.peca').fadeOut(self._animacaoTempo, function() {
				self._$tabuleiro.find('td[data-spot="'+movimento.para+'"]').html('');
				self.eventos.emitirMovimentoRevertido(movimento);
				if (typeof(posAcao) == 'function') { posAcao(); }
			}); 
		};
		
		this.movimentoPossivelNoEstadoAtual = function (de, para) {
			var movimento = (typeof(de) == "object") ? de : self._movimentos.ehValido(de, para);
			if (!movimento) return false;
			
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
			
			(function defazerRecusivo() {
				if (movimentosParaDesfazer.length == 0) {
					self.tornarPecasDraggables();
					return;
				}
				var $li = $(movimentosParaDesfazer.pop());
				$li.remove();
				var mSplit = $li.html().split('&gt;');
				var movimento = self._movimentos.ehValido(mSplit[0],mSplit[1]);
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
				
				$elemDragged = self._$tabuleiro.find('td[data-spot="'+movimento.de+'"]').children();
				$elemDrop    = self._$tabuleiro.find('td[data-spot="'+movimento.para+'"]');
				self.executar(movimento, $elemDragged, $elemDrop, executarRecusivo);
			})();
		};
		
		this.execucaoInicial = function(movimentosStr) {
			if (movimentosStr) {
				self.executarMovimentos(movimentosStr);
			}
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
		
	} //Tabuleiro
	
}


Resta1.Tabuleiro.modeloDefault = function(tema){ 
if (typeof(tema) != 'string') tema = '';

return '\
<table class="tabuleiro #tema">\
	<tr>\
		<td class="shore"></td>\
		<td class="shore"></td>\
		<td class="spot" data-spot="01"><div class="peca" /></td>\
		<td class="spot" data-spot="02"><div class="peca" /></td>\
		<td class="spot" data-spot="03"><div class="peca" /></td>\
		<td class="shore"></td>\
		<td class="shore"></td>\
	</tr>\
	<tr>\
		<td class="shore"></td>\
		<td class="shore"></td>\
		<td class="spot" data-spot="04"><div class="peca" /></td>\
		<td class="spot" data-spot="05"><div class="peca" /></td>\
		<td class="spot" data-spot="06"><div class="peca" /></td>\
		<td class="shore"></td>\
		<td class="shore"></td>\
	</tr>\
	<tr>\
		<td class="spot" data-spot="07"><div class="peca" /></td>\
		<td class="spot" data-spot="08"><div class="peca" /></td>\
		<td class="spot" data-spot="09"><div class="peca" /></td>\
		<td class="spot" data-spot="10"><div class="peca" /></td>\
		<td class="spot" data-spot="11"><div class="peca" /></td>\
		<td class="spot" data-spot="12"><div class="peca" /></td>\
		<td class="spot" data-spot="13"><div class="peca" /></td>\
	</tr>\
	<tr>\
		<td class="spot" data-spot="14"><div class="peca" /></td>\
		<td class="spot" data-spot="15"><div class="peca" /></td>\
		<td class="spot" data-spot="16"><div class="peca" /></td>\
		<td class="spot" data-spot="17"></td>\
		<td class="spot" data-spot="18"><div class="peca" /></td>\
		<td class="spot" data-spot="19"><div class="peca" /></td>\
		<td class="spot" data-spot="20"><div class="peca" /></td>\
	</tr>\
	<tr>\
		<td class="spot" data-spot="21"><div class="peca" /></td>\
		<td class="spot" data-spot="22"><div class="peca" /></td>\
		<td class="spot" data-spot="23"><div class="peca" /></td>\
		<td class="spot" data-spot="24"><div class="peca" /></td>\
		<td class="spot" data-spot="25"><div class="peca" /></td>\
		<td class="spot" data-spot="26"><div class="peca" /></td>\
		<td class="spot" data-spot="27"><div class="peca" /></td>\
	</tr>\
	<tr>\
		<td class="shore"></td>\
		<td class="shore"></td>\
		<td class="spot" data-spot="28"><div class="peca" /></td>\
		<td class="spot" data-spot="29"><div class="peca" /></td>\
		<td class="spot" data-spot="30"><div class="peca" /></td>\
		<td class="shore"></td>\
		<td class="shore"></td>\
	</tr>\
	<tr>\
		<td class="shore"></td>\
		<td class="shore"></td>\
		<td class="spot" data-spot="31"><div class="peca" /></td>\
		<td class="spot" data-spot="32"><div class="peca" /></td>\
		<td class="spot" data-spot="33"><div class="peca" /></td>\
		<td class="shore"></td>\
		<td class="shore"></td>\
	</tr>\
</table>\
'.replace('#tema', tema);
}

Resta1.Tabuleiro.MovimentosDefault = [["01","02","03"],["01","04","09"],["02","05","10"],["03","02","01"],["03","06","11"],["04","05","06"],["04","09","16"],["05","10","17"],["06","05","04"],["06","11","18"],["07","08","09"],["07","14","21"],["08","09","10"],["08","15","22"],["09","04","01"],["09","08","07"],["09","10","11"],["09","16","23"],["10","05","02"],["10","09","08"],["10","11","12"],["10","17","24"],["11","06","03"],["11","10","09"],["11","12","13"],["11","18","25"],["12","11","10"],["12","19","26"],["13","12","11"],["13","20","27"],["14","15","16"],["15","16","17"],["16","09","04"],["16","15","14"],["16","17","18"],["16","23","28"],["17","10","05"],["17","16","15"],["17","18","19"],["17","24","29"],["18","11","06"],["18","17","16"],["18","19","20"],["18","25","30"],["19","18","17"],["20","19","18"],["21","14","07"],["21","22","23"],["22","15","08"],["22","23","24"],["23","16","09"],["23","22","21"],["23","24","25"],["23","28","31"],["24","17","10"],["24","23","22"],["24","25","26"],["24","29","32"],["25","18","11"],["25","24","23"],["25","26","27"],["25","30","33"],["26","19","12"],["26","25","24"],["27","20","13"],["27","26","25"],["28","23","16"],["28","29","30"],["29","24","17"],["30","25","18"],["30","29","28"],["31","28","23"],["31","32","33"],["32","29","24"],["33","30","25"],["33","32","31"]];

/*#################################################*/
/*############         JQ.PLUGIN         ##########*/

(function($){
	$.fn.resta1 = function(options) {
		var settings = $.extend({}, $.fn.resta1.defaultOptions, options);

		return this.each(function() {
			var $this = $(this);
			
			if ($this.find('table').size() > 0) 
					settings.id = $this.find('table').get(0);
			else
				settings.appendTo = this;

			
			this.tabuleiro = new Resta1.Tabuleiro(settings);
			
		});
	};

	$.fn.resta1.defaultOptions = {
	};
})(jQuery);