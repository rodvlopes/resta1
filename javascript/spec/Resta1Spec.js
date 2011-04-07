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
					<td data-spot="1"><div class="peca" /></td>\
					<td data-spot="2"><div class="peca" /></td>\
					<td data-spot="3"></td>\
					</tr>\
				<tr>\
					<td data-spot="4"><div class="peca" /></td>\
					<td data-spot="5"><div class="peca" /></td>\
					<td data-spot="6"></td>\
				</tr>\
			</table>\
			<span id="contador"></span>\
		</div>\
		');

		tabuleiro = new Resta1.Tabuleiro({id : 'tabuleiro', movimentos : movimentos});
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
		it("sempre que uma peça sair do tabuleiro, devo disparar o evento", function() {
			$("#contador").bind('totalDePecasAlterado', function(event, novoValor){
				console.log(novoValor);
				$(this).text(novoValor);
			});
			tabuleiro.executar(['1', '2', '3']);
			waitsFor(function(){return $("#contador").text() == '3'}, 'O evento não foi emitido ou foi com o valor errado!', 200);
	  });
	});
	
}); //describe Tabuleiro

