var tabuleiro;

$(document).ready(function(){

	var movimentos = new Resta1.Movimentos({json : '/movimentos'});
	tabuleiro  = new Resta1.Tabuleiro({
		id : 'tabuleiro', 
		movimentos : movimentos,
		contadorId : 'pontuacao',
		listaMovimentosId : 'movimentos'
	});
	
	$('#executar-sequencia-tab').hide();
	
	//binds
	$('#reiniciar-btn').click(function() {
		tabuleiro.reiniciar();
	});
	
	$('#executar-sequencia-btn').click(function() {
		$('#executar-sequencia-tab').show();
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
		if (13 == KeyID && $(this).val().length > 2) {
			$('#executar-sequencia-sim-btn').click();
			return false;
		}
	});
		
});

if (!console) {console ={log : function(){}}};
