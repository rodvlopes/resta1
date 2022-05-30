var tabuleiro;
var ag;

$(document).ready(function(){
	
	ag = new AG({
		progresso : function(estado) {
			$('#geracao-num').html(estado.geracao);
			$('#melhor-individuo-fitness').html(estado.melhorIndividuo.fitness);
			$('#pior-individuo-fitness').html(estado.piorIndividuo.fitness);
			
			var estadoIndividuoTemplate = '<li><div class="fitness">#F</div><div class="individuo"><span class="execucaoInicial">#I</span></div></li>';
			
			$('#ag-individuos ul').html('');
			
			for(var i in estado.amostra) {
				var individuo = estado.amostra[i];
				var individuoLi = estadoIndividuoTemplate.replace('#F', individuo.fitness).replace('#I', individuo.genoma);
				$('#ag-individuo ul').append(individuoLi);
			}
			$('#ag-individuos .individuo').resta1({jogavel:false});
		}
	});

	var tabuleiroHeader = $('#tabuleiro-header').resta1({jogavel : false}).get(0).tabuleiro;
	
	tabuleiroHeader._$tabuleiro.find('td').each(function(){
		$(this).html(this.getAttribute('data-spot'));
	});

	tabuleiro = $('#tabuleiro-placeholder').resta1({
		contadorId : 'pontuacao',
		listaMovimentosId : 'movimentos'
	}).get(0).tabuleiro;
	
	$('#executar-sequencia-tab, #copiar-tab, #ag-individuos').hide();
	
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
		if ($(this).text() == 'Iniciar') {
	 		$(this).text('Pausar');
			ag.pausar();
		}
		else {
			$(this).text('Iniciar');
			$('#ag-individuos').show('fast');
			ag.iniciar();
		} 
	});
	
	$('#reset-ag-btn').click(function() {
		ag.reset();
		Notification.info('Execução interrompida. Estado resetado.', 'Info');
		$('#iniciar-ag-btn').text('Iniciar');
	});
		
});

if (!console) {console ={log : function(){}};}
