var tabuleiro;

$(document).ready(function(){

	var tabuleiroHeader = $('#tabuleiro-header').resta1({jogavel : false}).get(0).tabuleiro;
	
	tabuleiroHeader._$tabuleiro.find('td').each(function(){
		$(this).html(this.getAttribute('data-spot'));
	});

	tabuleiro = $('#tabuleiro-placeholder').resta1({
		contadorId : 'pontuacao',
		listaMovimentosId : 'movimentos'
	}).get(0).tabuleiro;
	
	$('#executar-sequencia-tab, #copiar-tab').hide();
	
	//binds
	$('#reiniciar-btn').click(function() {
		tabuleiro.reiniciar();
	});
	
	$('#executar-sequencia-btn').click(function() {
		$('#executar-sequencia-tab').toggle();
		$('#sequencia-text').focus();
	});
	
	$('#executar-sequencia-sim-btn').click(function() {
		$('#executar-sequencia-tab').hide();
		tabuleiro.executarMovimentos($('#sequencia-text').val());
	});
	
	$('#executar-sequencia-nao-btn').click(function() {
		$('#executar-sequencia-tab').hide();
	});
	
	$('#sequencia-text').keydown(function(e){
		var KeyID = e.keyCode;
		if (13 === KeyID && $(this).val().length > 2) {
			$('#executar-sequencia-sim-btn').click();
			return false;
		}
	});
	
	$('#copiar-btn').click(function() {
		$('#copiar-tab').toggle();
		var sequencia = '';
		tabuleiro._$listaMovimentos.find('li').each(function(){sequencia += $(this).text() + ' ';});
		$('#copiar-text').val(sequencia);
		$('#copiar-text').focus().select();
	});
		
});

if (!console) {console ={log : function(){}};}
