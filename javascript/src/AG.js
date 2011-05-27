var AG = {
		Execucao : function(params) {
		// {
		// 		genes : ['0', '1', '2'],
		// 		tamanhoGenoma : 3,
		// 		tamanhoPopulacao : 10,
		// 		geracaoFinal : 10,
		// 		
		// 		funcaoAfinidade : function(individuo)
		// 	}
	
		var self = this;
		self._params = params;
	
		function init() {
		
			self._gerarPopulacaoInicial();
		
		}
		
		self._gerarPopulacaoInicial = function() {
			var comprimento 	= self._params.tamanhoGenoma;
			var numIndividuos = self._params.tamanhoPopulacao;
			var genes 				= self._params.genes;
			self._populacao = AG.Helper.gerarIndividuos(numIndividuos, genes, comprimento);
		}
		
		/************** PUBLICO **************/
		self.iniciar = function() {
			
		}
		
		self.amostra = function() {
			return new AG.Amostra({
				populacao: self._populacao,
				tamanho: 6,
				geracao: 10
			});
		}
	
		init();
	
	},
	
	Individuo : function(genoma) {
		this.genoma = '';
		this.fitness = 0;
		
		if (typeof(genoma) == 'string') this.genoma = genoma
	},
	
	Amostra : function(params) {
		this.geracao = 0;
		var populacao = [];
		var tamanho = 0;
		
		if (typeof(params) == 'object') {
			if (typeof(params.geracao) == 'number') this.geracao = params.geracao;
			if (typeof(params.populacao) == 'object') populacao = params.populacao;
			if (typeof(params.tamanho) == 'number') tamanho = params.tamanho;
		}
		
		populacao.sort(function(a,b){return a.fitness - b.fitness});
		
		this.piorIndividuo = populacao.shift()
		this.melhorIndividuo = populacao.pop();
		
		this.push(this.piorIndividuo);
		for (var i=0; i<(tamanho-2); i++) {
			var rand = Math.floor(Math.random()*populacao.length);
			this.push(populacao.splice(rand,1)[0]);
		}
		this.push(this.melhorIndividuo);
		
		this.sort(function(a,b){return a.fitness - b.fitness});
	},
	
	Helper : {
		
		gerarIndividuos : function(individuosNum, genes, comprimento) {
			var individuos = [];
			for (var i=0; i<individuosNum; i++) {
				var genoma = '';
				for (var j=0; j<comprimento; j++){
					genoma += genes[Math.floor(Math.random()*genes.length)];
				}
				individuos.push(new AG.Individuo(genoma));	
			}
			return individuos;
		}
		
	}
}

AG.Amostra.prototype = new Array;
