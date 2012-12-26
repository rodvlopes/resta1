var AG = {
    Execucao : function(config) {
		// {
        // 		genes : ['0', '1', '2'],
        // 		tamanhoGenoma : 3,
        // 		tamanhoPopulacao : 10,
        // 		geracaoFinal : 10,
        //      taxaMutacao : 0.05, //(5%)
        //      periodoAmostra: 10, //lança um evento com uma amostra a cada x geracoes
        //      amostraHandler: function(amostra) { ... }
        // 		
        // 		funcaoAfinidade : function(individuo) { return 1; } //deve retornar um valor > 0, para selecao estocastica funcionar.
        // 	}
	
		var _this = this;
	
		function init() {
            
            var defaults = { geracao: 0, taxaMutacao: 0.05, geracaoFinal: 0, periodoAmostra : 10 }
            $.extend(_this, defaults, config);
			_this._gerarPopulacaoInicial();
            _this._calcularFitness();
            _this._normalizarFitnessEOrdenar();
		
		}
		
		_this._gerarPopulacaoInicial = function() {
			_this.populacao = AG.Helper.gerarIndividuos(_this.tamanhoPopulacao, _this.genes, _this.tamanhoGenoma);
		}
        
        _this.novaGeracao = function() {
            var novaPopulacao = [];
            
            while(novaPopulacao.length < _this.tamanhoPopulacao) {
                var casal = _this._selecionarUmCasal();
                var filho = _this._reproduzir(casal);
                novaPopulacao.push(filho);
                _this._posReproducao(casal);
            }
            
            _this.populacao = novaPopulacao;
            _this._calcularFitness();
            _this._normalizarFitnessEOrdenar();
            _this.geracao++;
		}
        
        _this._calcularFitness = function() {
            _this.populacao.forEach(function(individuo,index){
                individuo.fitness = _this.funcaoAfinidade(individuo);
                individuo.filhos = 0;
            });
        }
        
        _this._normalizarFitnessEOrdenar = function() {
            var fitnessAcumulado = 0;
            _this.populacao.forEach(function(individuo){
                fitnessAcumulado += individuo.fitness;
            });
            
            _this.populacao.sort(function(a,b){return a.fitness - b.fitness});
            
            for (var i = 0; i<_this.populacao.length; i++) {
                _this.populacao[i].index = i;
                var fitnessNormalizado = _this.populacao[i].fitness / fitnessAcumulado;
                _this.populacao[i].fitnessNormalizadoAcumulado = fitnessNormalizado;
                if (i!=0) 
                    _this.populacao[i].fitnessNormalizadoAcumulado += _this.populacao[i-1].fitnessNormalizadoAcumulado;
            }
        }
        
        _this._posReproducao = function(casal){
            var matouAlgum = false;
            casal.forEach(function(individuo){
                individuo.filhos++;
                if (individuo.filhos == 3) {
                    //console.log('individuo', individuo.genoma, 'tem 3 filhos');
                    _this.populacao.splice(individuo.index, 1);
                    matouAlgum = true;
                }
            });
            
            if (matouAlgum) _this._normalizarFitnessEOrdenar();
        }
        
        _this._selecionarUmCasal = function() {
            function selecionarEstocasticamente(populacao) {
                var random = Math.random();
                var populacao = _this.populacao;
                for (var i=0; i<populacao.length; i++) { //tem que varrer do menor para o maior
                    var individuo = populacao[i];
                    if (individuo.fitnessNormalizadoAcumulado >= random) return individuo;
                }
            }
            
            var pai = selecionarEstocasticamente();
            var mae = selecionarEstocasticamente();
            for (var i=0; mae.genoma == pai.genoma && i<5; i++) { //permiter que pai e mae sejam diferentes
                mae = selecionarEstocasticamente(_this.populacao, Math.random());
            }
            //console.log('selecionando pai', r1, pai.fitnessNormalizadoAcumulado, ' - selecionando mae', r2, mae.fitnessNormalizadoAcumulado);
            
            var casal = [pai, mae];
            return casal;
        }
        
        _this._reproduzir = function(casal) {
            console.assert(casal.length == 2, 'Casal deve ser formado por 2 indivíduos');
            var pai = casal[0];
            var mae = casal[1];
            
            var tamanhoGene = _this.genes[0].length;
            var pontoCruzamento = (parseInt(Math.random()*1000)%_this.tamanhoGenoma)*tamanhoGene;
            var filho = new AG.Individuo(pai.genoma.substr(0,pontoCruzamento) + mae.genoma.substr(pontoCruzamento));
            
            (function mutarGenoma(filho) {
                var chance = Math.random();
                if (chance < _this.taxaMutacao) {
                    //filho vai mutar
                    var posicaoGene = Math.floor(Math.random()*_this.tamanhoGenoma)*tamanhoGene
                    var novoGene = Math.floor(Math.random()*_this.genes.length);
                    for (var i=0; i<tamanhoGene; i++)
                        filho.genoma[posicaoGene+i] = _this.genes[novoGene][i];
                }
            })(filho);

            //console.log('pai', pai.genoma, '('+mae.fitness+')', 'mae', mae.genoma, '('+mae.fitness+')', 'filho', filho.genoma, 'cruzamento em', pontoCruzamento);
            return filho;
        }
		
		/************** PUBLICO **************/
		_this.iniciar = function() {
			
            while(_this.geracaoFinal == 0 || _this.geracao < _this.geracaoFinal) {
                
                _this.novaGeracao();
                
                if (_this.geracao % _this.periodoAmostra == 0 && _this.amostraHandler) {
                    _this.amostraHandler(_this.amostra());
                }
                
            }
            
		}
		
		_this.amostra = function() {
			return new AG.Amostra({
				populacao: _this.populacao,
				tamanhoAmostra: 6
			});
		}
	
		init();
	
	},
	
	Individuo : function(genoma, fitness) {
		this.genoma = genoma || '';
		this.fitness = fitness || 0;
		
		console.assert(typeof(this.genoma) == 'string', 'genoma tem que ser do tipo string');
        console.assert(typeof(this.fitness) == 'number', 'fitness tem que ser do tipo number');
	},
	
	Amostra : function(params) {
        $.extend(true, this, {
            populacao : [],
    	    tamanhoAmostra : 0
        }, params);
		
		
		//this.populacao.sort(function(a,b){return a.fitness - b.fitness});
		
		this.piorIndividuo   = this.populacao.shift();
		this.melhorIndividuo = this.populacao.pop();
		
        this.push(this.piorIndividuo);
        this.push(this.melhorIndividuo);
        
		for (var i=0; i<(this.tamanhoAmostra-2); i++) {
			var rand = Math.floor(Math.random()*this.populacao.length);
			this.push(this.populacao.splice(rand,1)[0]);
		}
		
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