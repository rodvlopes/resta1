describe("AG.Execucao", function() {

	beforeEach(function () {
	});

	describe("iniciar", function() {
	
		it("deve iniciar a execução e parar após 10 gerações", function(){
			var ag = new AG.Execucao({
				genes : ['0', '1', '2'],
				tamanhoGenoma : 3,
				tamanhoPopulacao : 10,
				geracaoFinal : 10,
				
				funcaoAfinidade : function(individuo) {
					individuo.fitness = 0;
					for (var i in individuo.genoma) {individuo.fitness += parseInt(individuo.genoma[i]);}
					return individuo;
				}
			});
			
			expect(ag._populacao.length).toEqual(10);
			expect(ag._populacao[0].genoma.length).toEqual(3);
			expect(ag._populacao[4].genoma.length).toEqual(3);
			expect(ag._populacao[9].genoma.length).toEqual(3);
			
			ag.iniciar();
			var amostraRecebida = ag.amostra();
				
			expect(amostraRecebida.geracao).toEqual(10);
			expect(amostraRecebida.melhorIndividuo.fitness).toBeTypeOf("number");
			expect(amostraRecebida.melhorIndividuo.genoma).toBeTypeOf("string");
			expect(amostraRecebida.piorIndividuo.fitness).toBeTypeOf("number");
			expect(amostraRecebida.piorIndividuo.genoma).toBeTypeOf("string");
			expect(amostraRecebida.length).toEqual(6);
		});
	
	});

	
	// describe("progresso", function() {
	// 
	// 	it("deve informar o progresso durante a execução", function(){
	// 		var amostraRecebido;
	// 		
	// 		var ag = new AG({
	// 			progresso : function(amostra) {
	// 				amostraRecebido = amostra;
	// 			}
	// 		});
	// 		
	// 		ag.iniciar();
	// 		
	// 		expect(amostraRecebido.geracao).toEqual(10);
	// 		expect(amostraRecebido.melhorIndividuo.fitness).toBeTypeOf("number");
	// 		expect(amostraRecebido.melhorIndividuo.genoma).toBeTypeOf("string");
	// 		expect(amostraRecebido.piorIndividuo.fitness).toBeTypeOf("number");
	// 		expect(amostraRecebido.piorIndividuo.genoma).toBeTypeOf("string");
	// 		expect(amostraRecebido.amostra.length).toEqual(6);
	// 	});
	// 
	// });
	
});




describe("AG.Helper", function() {

	describe("gerarIndividuo", function() {
		
		it("deve gerar um individuo aleatório", function(){
			var genes = ['1','2'];
			var comprimento = 3;
			var individuosNum = 50;
			var individuos = AG.Helper.gerarIndividuos(individuosNum, genes, comprimento);
			
			expect(individuos.length).toEqual(individuosNum);
			
			var taxaDiferenciacao = 0;
			var genomaAnterior = null;
			
			for (var i=0; i<individuosNum; i++) {
				var individuo = individuos[i];
				var genomaAtual = individuo.genoma;
				expect(genomaAtual.length).toEqual(comprimento);
				taxaDiferenciacao += genomaAtual == genomaAnterior ? 1 : 0;
				genomaAnterior = genomaAtual;
			}
			
			expect(taxaDiferenciacao).toBeLessThan(individuosNum/2);
		});
		
	});

});



describe("AG.Amostra", function() {

	describe("melhorIndividuo", function() {
		var populacao;
		
		beforeEach(function(){
			populacao = [
				{genoma : 'oPior', fitness: 0},
				{genoma : '111', fitness: 4},
				{genoma : '133', fitness: 2},
				{genoma : '333', fitness: 3},
				{genoma : '222', fitness: 5},
				{genoma : 'oMelhor', fitness: 10}
			];
		});
		
		it("deve retonar um amostra em ordem crescente de fitness", function(){

			var amostra = new AG.Amostra({populacao : populacao, tamanho: 6});
			
			expect(amostra.melhorIndividuo.genoma).toEqual('oMelhor');
			expect(amostra.piorIndividuo.genoma).toEqual('oPior');
			expect(amostra[0].genoma).toEqual('oPior');
			expect(amostra[1].genoma).toEqual('133');
			expect(amostra[2].genoma).toEqual('333');
			expect(amostra[3].genoma).toEqual('111');
			expect(amostra[4].genoma).toEqual('222');
			expect(amostra[5].genoma).toEqual('oMelhor');
		});
		
		it("deve retornar uma amosta melhor que a populacao em ordem crescente", function(){

			var amostra = new AG.Amostra({populacao : populacao, tamanho: 4, geracao: 1});
			
			expect(amostra.melhorIndividuo.genoma).toEqual('oMelhor');
			expect(amostra.piorIndividuo.genoma).toEqual('oPior');
			expect(amostra[0].genoma).toEqual('oPior');
			expect(amostra[1].fitness).toBeLessThan(amostra[2].fitness);
			expect(amostra[2].fitness).toBeLessThan(amostra[3].fitness);
			expect(amostra[3].genoma).toEqual('oMelhor');
			expect(amostra.geracao).toEqual(1);
		});
		
	});

});