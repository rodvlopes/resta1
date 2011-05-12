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
	
	$('#ag-individuos .individuo').resta1({jogavel:false});
	
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
		$('#copiar-text').val(tabuleiro.movimentosExecutadosString());
		$('#copiar-text').focus().select();
	});
	
	$('#iniciar-ag-btn').click(function() {
		$(this).text() == 'Iniciar' ? $(this).text('Pausar') : $(this).text('Iniciar');
	});
	
	$('#reset-ag-btn').click(function() {
		Notification.info('Execução interrompida. Estado resetado.', 'Info');
		$('#iniciar-ag-btn').text('Iniciar');
	});
		
});

if (!console) {console ={log : function(){}};}
