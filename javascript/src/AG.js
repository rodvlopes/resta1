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
	
		_this._init = function() {
            var defaults = { geracao: 0, taxaMutacao: 0.05, geracaoFinal: 0, periodoAmostra : 10, calculaDiversidade: false }
            $.extend(_this, defaults); 
            $.extend(_this, config);
            
            _this.tamanhoGene = _this.genes[0].length;
			_this._gerarPopulacaoInicial();
            
            //if (_this.calculaDiversidade)
                _this._calcularDiversidade();
            
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

            if (!_this.subExecucao && _this.geracao % 2 == 1 && _this.tamanhoPopulacao >= 12)
                _this._introduzirNovosIndividuos(novaPopulacao);
                
            _this.populacao = novaPopulacao;
            
            if (_this.calculaDiversidade)
                _this._calcularDiversidade();
                
            _this._calcularFitness();
            _this._normalizarFitnessEOrdenar();
            _this.geracao++;
		}
        
        
        _this._introduzirNovosIndividuos = function(populacao) {
            var newConfig = {};
            $.extend(newConfig, config);
            $.extend(newConfig, {subExecucao: true, geracaoFinal: 2, amostraHandler: null, tamanhoPopulacao: Math.floor(config.tamanhoPopulacao/2)});
            var newExecucao = new AG.Execucao(newConfig);
            newExecucao.iniciar();
            var amostra = newExecucao.amostra();
            amostra.forEach(function(individuo, i){ 
                //subtitui aleatoriamente o individuos da populacao atual com os novos
                var rand = Math.floor(Math.random()*populacao.length);
                populacao[i].genoma = individuo.genoma;
            });
        }
        
        
        _this._calcularDiversidade = function() {
            var amostra = _this.amostra();
            var frequencias = [];
            amostra.forEach(function(individuo, i){
                if (!individuo) return;
                
                var seqArr = individuo.genoma.match(new RegExp('.{'+ _this.tamanhoGene + '}', 'g'));
                seqArr.forEach(function(gene, k){
		            if (i == 0) frequencias[k] = [];
                    if (frequencias[k][gene]) frequencias[k][gene]++;
                    else frequencias[k][gene] = 1;
                });
            });
	    
            var genomaPopular = [];
            frequencias.forEach(function(f){
                var geneMaisFreq;
                var freqAnterior = -1;

                for (gene in f) {
                    if (f[gene] > freqAnterior) { geneMaisFreq = gene; freqAnterior = f[gene]; }
                }
                
                genomaPopular.push(geneMaisFreq);
            });
            
            _this.populacao.forEach(function(individuo){
                var seqArr = individuo.genoma.match(new RegExp('.{'+ _this.tamanhoGene + '}', 'g'));
                individuo.diversidade = _this.tamanhoGenoma;
                seqArr.forEach(function(gene, k){
                    if (gene == genomaPopular[k]) individuo.diversidade--;
                });
            });
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
            
            var casal = [pai, mae];
            return casal;
        }
        
        _this._reproduzir = function(casal) {
            var pai = casal[0];
            var mae = casal[1];
            
            var pontoCruzamento = (parseInt(Math.random()*1000)%_this.tamanhoGenoma)*_this.tamanhoGene;
            var filho = new AG.Individuo(pai.genoma.substr(0,pontoCruzamento) + mae.genoma.substr(pontoCruzamento));
            
            (function mutarGenoma(filho) {
                var chance = Math.random();
                if (chance < _this.taxaMutacao) {
                    //filho vai mutar
                    var posicaoGene = Math.floor(Math.random()*_this.tamanhoGenoma)*_this.tamanhoGene
                    var novoGene = Math.floor(Math.random()*_this.genes.length);
                    for (var i=0; i<_this.tamanhoGene; i++)
                        filho.genoma[posicaoGene+i] = _this.genes[novoGene][i];
                }
            })(filho);

            return filho;
        }
		
		/************** PUBLICO **************/
		_this.iniciar = function() {
			
            while(_this.geracaoFinal == 0 || _this.geracao < _this.geracaoFinal) {
                
                _this.novaGeracao();
                
                if (_this.geracao % _this.periodoAmostra == 0 && _this.amostraHandler && !_this.subExecucao) {
                    _this.amostraHandler(_this.amostra());
                }
                
            }
            
		}
		
		_this.amostra = function(tamanhoAmostra) {
            var tamanhoAmostra = tamanhoAmostra ? tamanhoAmostra : Math.max(6, Math.min(Math.round(_this.tamanhoPopulacao/10), 40));
			return new AG.Amostra({
				populacao: _this.populacao,
				tamanhoAmostra: tamanhoAmostra,
                geracao: _this.geracao
			});
		}
	
		_this._init();
	
	},
	
	Individuo : function(genoma, fitness) {
		this.genoma = genoma || '';
		this.fitness = fitness || 0;
	},
	
	Amostra : function(params) {
        $.extend(this, {
            populacao: [],
    	    tamanhoAmostra: 0,
            geracao: 0
        });
        
        $.extend(this, params);
        this.populacao = _.clone(params.populacao);
		
		
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