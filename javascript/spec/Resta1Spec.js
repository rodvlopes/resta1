describe("Resta1.Movimentos", function() {
  var movimentos;

  beforeEach(function() {
		var lista_movimentos = [['1', '2', '3'], ['4', '5', '6'], ['3', '2', '1']];
    movimentos = new Resta1.Movimentos({movimentos : lista_movimentos});
  });

	describe("ehValido?", function() {

	  it("deve retornar o movimento dado de,para", function() {
			movimento = movimentos.ehValido('1', '3');
	    expect(movimento.toArray()).toEqual(['1', '2', '3']);
	  });
	
	  it("deve retornar false quando não encontrar um movimento dado de,para ", function() {
			movimento = movimentos.ehValido('3', '3');
	    expect(movimento).toBeFalsy();
	  });
	
	}); //describe ehValido?
	
}); //describe Movimentos


describe("Resta1.Tabuleiro", function() {
	var tabuleiro;
	var movimentos;
	
	beforeEach(function () {
    movimentos = new Resta1.Movimentos({
			movimentos : [['1', '2', '3'], ['3', '2', '1'], ['4', '5', '6'], ['6', '5', '4']]
		});
		
		$('#fixture').remove();
		$('body').append(' \
		<div id="fixture">\
			<div id="testeAppend"></div>\
			<div id="testeAppend2"></div>\
			<div id="testeAppend3"></div>\
			<table id="tabuleiro">\
				<tr>\
					<td class="shore"></td>\
					<td class="spot" data-spot="1"><div class="peca" /></td>\
					<td class="spot" data-spot="2"><div class="peca" /></td>\
					<td class="spot" data-spot="3"></td>\
					<td class="shore"></td>\
				</tr>\
				<tr>\
					<td class="shore"></td>\
					<td class="spot" data-spot="4"><div class="peca" /></td>\
					<td class="spot" data-spot="5"><div class="peca" /></td>\
					<td class="spot" data-spot="6"></td>\
					<td class="shore"></td>\
				</tr>\
			</table>\
			<span id="contador"></span>\
			<div id="movimentos"></div>\
		</div>\
		');

		tabuleiro = new Resta1.Tabuleiro({id : 'tabuleiro', movimentos : movimentos, contadorId : 'contador', listaMovimentosId : 'movimentos'});
  });

	it("deve tornar as peças draggables", function() {
		expect( $('#tabuleiro div.ui-draggable').length ).toEqual(4);
  });

	it("deve criar o html default do tabuleiro quando passar o atributo appendTo e ignorar o id", function(){
		var tab = new Resta1.Tabuleiro({appendTo: 'testeAppend', id : 'tabuleiro', movimentos : []});
		expect($('#testeAppend').find('.peca').size()).toEqual(32);
		expect(tab._$tabuleiro.get(0).nodeName).toEqual('TABLE');
	});
	
	it("deve usar os movimentos default quando nenhum movimento for passado", function(){
		var tab = new Resta1.Tabuleiro({appendTo: 'testeAppend', id : 'tabuleiro'});
		var primeiroMovimento = tab._movimentos._movimentos[0];
		var ultimoMovimento = tab._movimentos._movimentos[tab._movimentos._movimentos.length-1];
		expect(primeiroMovimento.equals(["01","02","03"])).toBeTruthy();
		expect(ultimoMovimento.equals(["33","32","31"])).toBeTruthy();
	});
	
	describe('movimentoPossivelNoEstadoAtual?', function() {
		it("deve retornar true quando for possível no estado atual", function() {
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('1', '3') ).toEqual(true);
	  });
	
		it("deve retornar false quando não for possível no estado atual", function() {
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('3', '1') ).toEqual(false);
	  });
	
		it("deve retornar false quando é um movimento inválido", function() {
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('3', '9') ).toEqual(false);
	  });
	});
	
	
	describe('Ao comer uma peça', function() {
		it("devo disparar o evento totalDePecasAlterado", function() {
			$(tabuleiro).bind('totalDePecasAlterado', function(event, novoValor){
				tabuleiro._$contador.text(novoValor);
			});
			tabuleiro.executarMovimentos('1>3');
			waitsFor(function(){return tabuleiro._$contador.text() == '3'}, 'O evento não foi emitido ou foi com o valor errado!', 200);
	  });
	
		it("devo disparar o evento pecaComida com o movimento", function() {
			var movimento = new Resta1.Movimento([0,0,0]);
			$(tabuleiro).bind('pecaComida', function(event, m){
				movimento = m;
			});
			tabuleiro.executarMovimentos('1>3');
			waitsFor(function(){return movimento.equals('1','3');}, 'O evento não foi emitido ou foi com o valor errado!', 200);
	  });
	});
	
	
	describe('reiniciar', function() {
		it("deve voltar para o estado inicial do tabuleiro", function() {
			tabuleiro.executarMovimentos('1>3 4>6');
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('1', '3') ).toEqual(false);
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('4', '6') ).toEqual(false);
			tabuleiro.reiniciar();
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('1', '3') ).toEqual(true);
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('4', '6') ).toEqual(true);
	  });
	
		it("deve lançar o evento jogoReiniciado", function() {
			var reiniciado = false;
			$(tabuleiro).bind('jogoReiniciado', function(event){
				reiniciado = true;
			});
			tabuleiro.reiniciar();
			waitsFor(function(){return reiniciado}, 'O evento não foi emitido ou foi com o valor errado!', 200);
		});
	
	});
	
	describe('lista de movimentos', function() {
		it("deve adicionar uma ul vazia quando receber o parâmetro listaMovimentosId", function() {
			expect( tabuleiro._$listaMovimentos.length ).toEqual(1);
	  });
	
		it("deve limpar a lista de movimentos ao reiniciar", function() {
			tabuleiro.executarMovimentos('1>3');
			tabuleiro.reiniciar();
			expect( tabuleiro._$listaMovimentos.find('li').length ).toEqual(0);
	  });
	
		it("deve adicionar o movimento na lista após uma execução", function() {
			tabuleiro.executarMovimentos('1>3');
			waitsFor(function(){
				return (
					tabuleiro._$listaMovimentos.find('li').length == 1 &&
					tabuleiro._$listaMovimentos.find('li:first').html() == "1&gt;3"
				);
			}, 'li ser adicionada na lista de movimentos', 200);
	  });
	
		it("deve recuperar uma string com todos os movimentos", function() {
			tabuleiro.executarMovimentos('1>3');
			tabuleiro.executarMovimentos('4>6');
			expect(tabuleiro.movimentosExecutadosString()).toEqual('1>3 4>6');
	  });
	});
	

	describe('desfazerMovimentosSelecionados', function() {
		beforeEach(function() {
			tabuleiro.executarMovimentos('1>3 4>6');
			tabuleiro._$listaMovimentos.find('li:last').addClass('para-remover'); //simula o click no ultimo movimento da lista
			tabuleiro.desfazerMovimentosSelecionados();
		});
		
		it("deve desfazer a lista de movimentos selecionados", function() {
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('1', '3') ).toEqual(false);
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('4', '6') ).toEqual(true);
	  });		
			
		it("deve retirar os passos da lista de movimentos", function() {
			expect( tabuleiro._$listaMovimentos.find('li:last').html() ).toEqual("1&gt;3");
	  });
		
		it("deve atualizar o contador", function() {
			expect( tabuleiro._$contador.html() ).toEqual("3");
	  });
	});
	
	
	describe('executarMovimentos', function() {		
		it("deve executar um lista de movimentos válidos", function() {
			tabuleiro.executarMovimentos('1>3 4>6');
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('1', '3') ).toEqual(false);
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('4', '6') ).toEqual(false);
	  });
	
		it("deve executar um lista de movimentos válidos com input imperfeito", function() {
			tabuleiro.executarMovimentos('    1>3       4>6           ');
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('1', '3') ).toEqual(false);
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('4', '6') ).toEqual(false);
	  });
	
		it("deve lançar uma notificação quando houver um movimento inválido na sequência e parar", function() {
			spyOn(Notification, 'error');
			tabuleiro.executarMovimentos('1>3 6>6');
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('1', '3') ).toEqual(true);
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('4', '6') ).toEqual(true);
			expect(Notification.error).toHaveBeenCalledWith("Esta sequência de movimentos não é válida. Movimento incorreto encontrado: 6>6.", "Erro");
			  });
			
		it("deve lançar uma notificação quando o movimento for inválido no estado atual executando até o erro", function() {
			spyOn(Notification, 'error');
			tabuleiro.executarMovimentos('1>3 1>3');
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('1', '3') ).toEqual(false);
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('4', '6') ).toEqual(true);
			expect(Notification.error).toHaveBeenCalledWith("O movimento 1>3 não pode ser executado no estado atual.", "Erro");
	  });
	
		it("deve executar a sequencia mesmo quando existir outras instância no DOM", function() {
			new Resta1.Tabuleiro({appendTo: 'testeAppend2'});
			new Resta1.Tabuleiro({appendTo: 'testeAppend3'});
			
			tabuleiro = new Resta1.Tabuleiro({appendTo: 'testeAppend'});
			var sequenciaGrande = '19>17 30>18 27>25 13>27 24>26 22>24 08>22 21>23 23>25 07>21 31>23 32>24 18>30 33>25 24>22 10>24 25>23 12>10 09>11 23>09 21>23 27>25'; 
			tabuleiro.executarMovimentos(sequenciaGrande);
 
			var casas = tabuleiro._$tabuleiro.find('td').get();
			for(var i=0; i<casas.length; i++) {
				var numPecasNaCasa = $(casas[i]).find('.peca').size();
				expect(numPecasNaCasa == 0 || numPecasNaCasa == 1).toBeTruthy();
			}
			
			var numPecaEsperado = 32 - sequenciaGrande.split(' ').length;
			expect(tabuleiro._$tabuleiro.find('.peca').size()).toEqual(numPecaEsperado);
	  });	
	});
	
	
}); //describe Tabuleiro


//JQ.Plugin
describe("JQuery.resta1", function() {

	beforeEach(function () {
	  movimentos = new Resta1.Movimentos({
			movimentos : [['1', '2', '3'], ['3', '2', '1'], ['4', '5', '6'], ['6', '5', '4']]
		});
	
		$('#fixture').remove();
		$('body').append(' \
		<div id="fixture">\
			<div id="tabuleiro"></div>\
			<div id="tabuleiro2">\
				<table>\
					<tr>\
						<td class="shore"></td>\
						<td class="spot" data-spot="1"><div class="peca" /></td>\
						<td class="spot" data-spot="2"><div class="peca" /></td>\
						<td class="spot" data-spot="3"></td>\
						<td class="shore"></td>\
					</tr>\
					<tr>\
						<td class="shore"></td>\
						<td class="spot" data-spot="4"><div class="peca" /></td>\
						<td class="spot" data-spot="5"><div class="peca" /></td>\
						<td class="spot" data-spot="6"></td>\
						<td class="shore"></td>\
					</tr>\
				</table>\
			</div>\
			<span id="contador"></span>\
			<div id="movimentos"></div>\
		</div>\
		');
	});
	
	it("deve criar um tabuleiro resta1 default", function(){
		$('#tabuleiro').resta1();
		expect($('#tabuleiro').find('.peca').size()).toEqual(32);
		expect($('#tabuleiro table').size()).toEqual(1);
	});
	
	it("deve criar um tabuleiro resta1 customizado", function(){
		var tab = $('#tabuleiro2').resta1().get(0).tabuleiro;
		expect(tab._$tabuleiro.find('.peca').size()).toEqual(4);
	});
	
	it("deve aceitar parametros de configuracao", function(){
		$('#tabuleiro').resta1({tema: 'azul'});
		expect($('#tabuleiro .azul').size()).toEqual(1);
	});
});
