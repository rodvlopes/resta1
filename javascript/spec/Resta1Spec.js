//TODO: Refatorar o esquema de eventos. Novo Evento: reiniciar.
//TODO: A resposabilidade do contador deve ser do próprio componente.

describe("Resta1.Movimentos", function() {
  var movimentos;

  beforeEach(function() {
		var lista_movimentos = [['1', '2', '3'], ['4', '5', '6'], ['3', '2', '1']];
    movimentos = new Resta1.Movimentos({movimentos : lista_movimentos});
  });

	describe("ehValido?", function() {

	  it("deve retornar o movimento dado de,para", function() {
			movimento = movimentos.ehValido('1', '3');
	    expect(movimento).toEqual(['1', '2', '3']);
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

		tabuleiro = new Resta1.Tabuleiro({id : 'tabuleiro', movimentos : movimentos, listaMovimentosId : 'movimentos'});
  });

	it("deve tornar as peças draggables", function() {
		expect( $('#tabuleiro div.ui-draggable').length ).toEqual(4);
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
	
	
	describe('Evento:totalDePecasAlterado', function() {
		it("devo disparar o evento sempre que uma peça sair do tabuleiro", function() {
			$("#contador").bind('totalDePecasAlterado', function(event, novoValor){
				$(this).text(novoValor);
			});
			SpecHelper.executarMovimento(tabuleiro, ['1', '2', '3']);
			waitsFor(function(){return $("#contador").text() == '3'}, 'O evento não foi emitido ou foi com o valor errado!', 200);
	  });
	});
	
	
	describe('reiniciar', function() {
		it("deve voltar para o estado inicial do tabuleiro", function() {
			SpecHelper.executarMovimento(tabuleiro, ['1', '2', '3']);
			SpecHelper.executarMovimento(tabuleiro, ['4', '5', '6']);
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('1', '3') ).toEqual(false);
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('4', '6') ).toEqual(false);
			tabuleiro.reiniciar();
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('1', '3') ).toEqual(true);
			expect( tabuleiro.movimentoPossivelNoEstadoAtual('4', '6') ).toEqual(true);
	  });
	
		it("deve limpar a lista de movimentos", function() {
			SpecHelper.executarMovimento(tabuleiro, ['1', '2', '3']);
			expect( $('#movimentos ul li').length ).toEqual(1);
			tabuleiro.reiniciar();
			expect( $('#movimentos ul li').length ).toEqual(0);
	  });
	});
	
	describe('lista de movimentos', function() {
		it("deve adicionar uma ul vazia quando receber o parâmetro listaMovimentosId", function() {
			expect( $('#movimentos ul').length ).toEqual(1);
	  });
	
		it("deve adicionar o movimento na lista após uma execução", function() {
			SpecHelper.executarMovimento(tabuleiro, ['1', '2', '3']);
			waitsFor(function(){
				return (
					$('#movimentos ul li').length == 1 &&
					$('#movimentos ul li:first').html() == "1&gt;3"
				);
			}, 'li ser adicionada na lista de movimentos', 200);
	  });
	});
	

	describe('desfazerMovimentosSelecionados', function() {
		beforeEach(function() {
			SpecHelper.executarMovimento(tabuleiro, ['1', '2', '3']);
			SpecHelper.executarMovimento(tabuleiro, ['4', '5', '6']);
			tabuleiro._$listaMovimentos.find('li:last').addClass('para-remover');
			console.log(tabuleiro._$listaMovimentos.find('li'));
			tabuleiro.desfazerMovimentosSelecionados();
		});
		
		// it("deve desfazer a lista de movimentos selecionados", function() {
		// 	expect( tabuleiro.movimentoPossivelNoEstadoAtual('1', '3') ).toEqual(false);
		// 	expect( tabuleiro.movimentoPossivelNoEstadoAtual('4', '6') ).toEqual(true);
		// 	  });		
		
		it("deve retirar os passos da lista de movimentos", function() {
			//expect( tabuleiro._$listaMovimentos.find('li:last').html() ).toEqual("1&gt;3");
			console.log(tabuleiro._$listaMovimentos.find('li'));
	  });
	
		// it("deve atualizar o contador", function() {
		// 	expect( tabuleiro._$contador.html() ).toEqual("3");
		// 	  });
	});
	
	
}); //describe Tabuleiro
