(function testesAG(){
	console.log('Inciando os testes do componente AG...');
    var config = {
         	genes : ['0', '1', '2'],
	 		tamanhoGenoma : 3,
	 		tamanhoPopulacao : 10,
	 		geracaoFinal : 10,
            periodoAmostra: 5,
            amostraHandler: function(amostra) { console.log(amostra); },
	 		
	 		funcaoAfinidade : function(individuo) { 
                 var acumulador = 0; 
                 individuo.genoma.split('').forEach(function(s){ acumulador += parseInt(s); });
                 return acumulador;
             }
 	}
     
    var execucao = new AG.Execucao(config);
    
    //Testes de Execucao e Individuo
    console.assert(execucao.populacao.length == 10, 'Tamanho da população deve ser 10');
    console.assert(execucao.populacao[0].genoma.length == 3, 'Tamanho do genoma dos indiíduos deve ser 3');
    console.assert(execucao.populacao[0].genoma[0] == '0' ||
                   execucao.populacao[0].genoma[0] == '1' || 
                   execucao.populacao[0].genoma[0] == '2', 'Genoma deve ser composto apenas por genes permitidos 0,1 ou 2');
   
    
    //Testes de diversidade
    config.tamanhoPopulacao = 6;
    execucao = new AG.Execucao(config);
    execucao.populacao[0].genoma = '000';
    execucao.populacao[1].genoma = '001';
    execucao.populacao[2].genoma = '120';
    execucao.populacao[3].genoma = '022';
    execucao.populacao[4].genoma = '120';
    execucao.populacao[5].genoma = '120';
    execucao._calcularDiversidade();
    console.assert(execucao.populacao[0].diversidade === 1, 'Deversidade do individuo 0 deveria ser 2');
    console.assert(execucao.populacao[1].diversidade === 2, 'Deversidade do individuo 1 deveria ser 3');
    console.assert(execucao.populacao[2].diversidade === 1, 'Deversidade do individuo 2 deveria ser 0');
    console.assert(execucao.populacao[3].diversidade === 1, 'Deversidade do individuo 3 deveria ser 3');
    console.assert(execucao.populacao[4].diversidade === 1, 'Deversidade do individuo 4 deveria ser 0');
    console.assert(execucao.populacao[5].diversidade === 1, 'Deversidade do individuo 5 deveria ser 0');
    
    
    //Testes de aplicao do fitness function
    config.tamanhoPopulacao = 3;
    execucao = new AG.Execucao(config);
    execucao.populacao[0].genoma = '000';
    execucao.populacao[1].genoma = '001';
    execucao.populacao[2].genoma = '120';
    execucao._calcularFitness();
    execucao._normalizarFitnessEOrdenar();
    console.assert(execucao.populacao[0].fitnessNormalizadoAcumulado == 0,      'Fitness deveria ser 0');
    console.assert(execucao.populacao[1].fitnessNormalizadoAcumulado == 0.25,   'Fitness deveria ser 0.25');
    console.assert(execucao.populacao[2].fitnessNormalizadoAcumulado == 1,      'Fitness deveria ser 0.75');
    
    
    //Testes de Amostra
    var amostra = execucao.amostra();
    console.assert(amostra.length == 6,       'Tamanho da amostra tem que ser 6');
    console.assert(amostra.piorIndividuo.fitness == 0,  'O piorIndividuo indivíduo deve ser o pior');
    console.assert(amostra.melhorIndividuo.fitness == 3, 'O melhorIndividuo indivíduo deve ser o melhor');
    
    //Testes de seleção e reprodução
    var casal = execucao._selecionarUmCasal();
    console.assert(casal.length == 2,   'Casal deve ser formado por 2 indivíduos');
    var filho = execucao._reproduzir(casal);
    console.assert(filho.genoma.length == 3, 'Genoma do filho tem que ser do mesmo tamanho dos pais');
    
    //Testes de geração de uma nova população
    var populacaoAnterior = $.extend(true, [], execucao.populacao); //clone
    execucao.novaGeracao();
    var novosIndividuosDiferentes = 0;
    populacaoAnterior.forEach(function(old, i){ if (old.genoma != execucao.populacao[i].genoma) novosIndividuosDiferentes++; });
    console.assert(execucao.populacao.length == populacaoAnterior.length, 'A nova geração deve ter tantos indivíduos quanto a geracao anterior');
    console.assert(novosIndividuosDiferentes > 0);
    
    execucao.iniciar();
    console.log('Finalizado os teste do componente AG.');
})();


(function testesBuscaUnitario() {
	console.log('Inciando os testes do componente Busca unitário...');
	
    /*
        012 -> 0123 -> 01233
                    -> 01234 *
            -> 0125 *
            -> 0121
                    -> 01211
                    -> 01214
                    -> 01215 *
            -> 0122
        
        largura:        0125, 01234, 01215
        profundidade:   01234, 0125, 01215
    */
    
	//stub do board
	var Resta1Stub = {
		Board : function(config) {
			this.sequencia = config.sequencia;
			
			this.score = function() {
				if (this.sequencia == '01234') return 1;
				if (this.sequencia == '0125' ) return 1;
				if (this.sequencia == '01215') return 1;
				return 0;
			}
			
			this.validMovesNow = function() {
				if (this.sequencia == '012')  return [3,5,1,2];
				if (this.sequencia == '0123') return [3,4];
				if (this.sequencia == '0125') return [];
				if (this.sequencia == '0121') return [1,4,5];
				if (this.sequencia.charAt( this.sequencia.length-1 ) == '6') return [];
				return [6];
			}
			
			this.runSequence = function(s) {
				this.sequencia = s;
			}
            
            this.reset = function() {
                //do nothing
            }
		}
	}
	
	
	var board = new Resta1Stub.Board({sequencia: '012'});
	var busca = new Busca({
        sequenciaInicial: '012',
		sequencia: function() {
			return board.sequence.toString();
		},
		objetivo: function(sequencia) {
            board.reset(); 
            board.runSequence(sequencia);
			return board.score() == 1;
		},
		movimentos: function() {
			return board.validMovesNow();
		}
	});
	var solucoes = busca.solucoes();
	
	console.assert(solucoes[0] == '01215');
	console.assert(solucoes[1] == '0125' );
	console.assert(solucoes[2] == '01234');

	board.sequencia = '012';
	solucoes = busca.solucoes(2);
	console.assert(solucoes.length == 2);
    console.log('Finalizado os testes do componente Busca unitário.')
	
})();


(function testesIntegracao() {
    console.log('Inciando os testes do componente Busca integrado...');
	console.time('busca');
    
    var sequenciaIncial = "3166707175370635475530103271494365562965010916400269044436";
    var board = new Resta1.Board({noView:true});
    board.runSequence(sequenciaIncial);
    
    var busca = new Busca({
        sequenciaInicial: sequenciaIncial,
		sequencia: function() {
			return board.sequence.toString();
		},
		objetivo: function(sequencia) {
            board.reset(); 
            board.runSequence(sequencia);
			return board.score() == 1;
		},
		movimentos: function() {
			return board.validMovesIndexNow();
		}
	});
	var solucoes = busca.solucoes();
	
	console.timeEnd('busca');
	console.assert(solucoes[0] == "31667071753706354755301032714943655629650109164002690444362618");
	console.assert(solucoes[1] == '31667071753706354755301032714943655629650109164002690444362607');
    console.log('Finalizado os testes do componente Busca integrado.')

})();