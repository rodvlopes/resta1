//TODO: refatorar o nome das variáveis que não estão camelCase

var Resta1 = {

	/*##################################################*/
	/*############        MOVIMENTOS         ##########*/
	
	Movimentos : function (params) {
		if (params['movimentos']) {
			this._movimentos = params['movimentos'];
		}
		else if (params['json']) {
			var self = this;
			$.getJSON(params['json'], function(lista_movimentos){
				self._movimentos = lista_movimentos;
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
		
		self._id = params['id'];
		self._$tabuleiro = $("#"+self._id);
		if (self._$tabuleiro.length != 1) console.log('Erro: Tabuleiro não encontrado!');
		
		self._movimentos = params['movimentos'];
		if (!self._movimentos) console.log('Erro: Tabuleiro precisa regras de movimento para funcionar!');
		
		self._contador = 'contador';
		if (params['contador']) self._contador = params['contador'];
		self._$contador = $("#"+self._contador);
	
		$("#tabuleiro .peca").draggable({
		   revert: 'invalid'
		});

		self._$tabuleiro.find("td").droppable({
			accept: function(elemento) {
				var para_spot = this.getAttribute('data-spot');
				var de_spot   = elemento.parent().get(0).getAttribute('data-spot');
				return self.movimentoPossivelNoEstadoAtual(de_spot, para_spot);
	    },
			activate: function(event, ui) {
				var para_spot = this.getAttribute('data-spot');
				var de_spot   = ui.draggable.parent().get(0).getAttribute('data-spot');
				if (self._movimentos.ehValido(de_spot, para_spot)) {
					self._$tabuleiro.find('td[data-spot="'+para_spot+'"]').addClass('highlight');
				}			
			},
			deactivate: function() {
				self._$tabuleiro.find('td').removeClass('highlight');
			},
			drop: function(event, ui) {
				var para_spot = this.getAttribute('data-spot');
				var de_spot   = ui.draggable.parent().get(0).getAttribute('data-spot');
				var movimento = self._movimentos.ehValido(de_spot, para_spot);
				
				self.executar(movimento);
				
				$(this).append(ui.draggable.css('top','0').css('left', '0'));
				self._$tabuleiro.find('td').removeClass('highlight');
				
			}
		});
		
		
		//Métodos
		this.executar = function(movimento) {
			var meio_spot = movimento[1]
			self._$tabuleiro.find('td[data-spot="'+meio_spot+'"]').children()
				.fadeOut(function(){
					$(this).remove();
					var totalPecas = self._$tabuleiro.find('.peca').length;
					self._$contador.trigger('totalDePecasAlterado', [totalPecas]);
				});
		};
		
		this.movimentoPossivelNoEstadoAtual = function (de, para) {
			var movimento = self._movimentos.ehValido(de, para)
			if (!movimento) return false;
			
			var meio_spot = movimento[1];
			var para_spot = movimento[2];
			return 	self._$tabuleiro.find('td[data-spot="'+meio_spot+'"]').children().length >  0 &&
							self._$tabuleiro.find('td[data-spot="'+para_spot+'"]').children().length == 0;
		};
		
	}//Tabuleiro
	
}