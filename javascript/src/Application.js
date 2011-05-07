var tabuleiro;

$(document).ready(function(){

	tabuleiro  = new Resta1.Tabuleiro({
		appendTo : 'tabuleiro-placeholder', 
		contadorId : 'pontuacao',
		listaMovimentosId : 'movimentos',
		execucaoInicial : '19>17 30>18 27>25 13>27 11>13 17>19 29>17 09>11',
		instantaneo : true
	});
	
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
