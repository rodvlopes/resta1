(function testes(){
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
    console.log('Testes passaram com sucesso.');
})();