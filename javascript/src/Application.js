var tabuleiro;

$(document).ready(function(){

	var movimentos = new Resta1.Movimentos({json : '/movimentos'});
	tabuleiro  = new Resta1.Tabuleiro({
		id : 'tabuleiro', 
		movimentos : movimentos,
		contadorId : 'pontuacao',
		listaMovimentosId : 'movimentos'
	});
	
	$('#pontuacao').bind('totalDePecasAlterado', function(event, novoValor) {
		$(this).text(novoValor);
	});
	
	//binds
	$('#reiniciar-btn').click(function() {
		tabuleiro.reiniciar();
	});
	
});

if (!console) {console ={log : function(){}}};
