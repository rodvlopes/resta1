//winning sequence: "31667071753706354755301032714943655629650109164002690444362607"

var Resta1 = {
    Board : function(config) {
        
        var config = $.extend({
                width: 400,
                height: 300,
                container: 'body',
                noView: false,
                compactView: false
        }, config);
        
        var width = config.width,
            height = config.height,
            slotw = Math.floor(width/7), 
        	dslotw = Math.floor(slotw/2), 
        	sloth = Math.floor(height/7),
        	dsloth = Math.floor(sloth/2),
        	radius = Math.floor(0.35 * Math.min(slotw, sloth));
            
        var board = [
        	{x: 2*slotw, y:0}, {x:3*slotw, y:0}, {x:4*slotw, y:0},
        	{x: 2*slotw, y:sloth}, {x:3*slotw, y:sloth}, {x:4*slotw, y:sloth},
        	{x:0, y:2*sloth}, {x:1*slotw, y:2*sloth}, {x:2*slotw, y:2*sloth}, {x:3*slotw, y:2*sloth}, {x:4*slotw, y:2*sloth}, {x:5*slotw, y:2*sloth}, {x:6*slotw, y:2*sloth},
        	{x:0, y:3*sloth}, {x:1*slotw, y:3*sloth}, {x:2*slotw, y:3*sloth}, {x:3*slotw, y:3*sloth}, {x:4*slotw, y:3*sloth}, {x:5*slotw, y:3*sloth}, {x:6*slotw, y:3*sloth},
        	{x:0, y:4*sloth}, {x:1*slotw, y:4*sloth}, {x:2*slotw, y:4*sloth}, {x:3*slotw, y:4*sloth}, {x:4*slotw, y:4*sloth}, {x:5*slotw, y:4*sloth}, {x:6*slotw, y:4*sloth},
        	{x: 2*slotw, y:5*sloth}, {x:3*slotw, y:5*sloth}, {x:4*slotw, y:5*sloth},
        	{x: 2*slotw, y:6*sloth}, {x:3*slotw, y:6*sloth}, {x:4*slotw, y:6*sloth}
        ];
        
        board.validMoves = [[0,1,2],[0,3,8],[1,4,9],[2,1,0],[2,5,10],[3,4,5],[3,8,15],[4,9,16],[5,4,3],[5,10,17],[6,7,8],[6,13,20],[7,8,9],[7,14,21],[8,3,0],[8,7,6],[8,9,10],[8,15,22],[9,4,1],[9,8,7],[9,10,11],[9,16,23],[10,5,2],[10,9,8],[10,11,12],[10,17,24],[11,10,9],[11,18,25],[12,11,10],[12,19,26],[13,14,15],[14,15,16],[15,8,3],[15,14,13],[15,16,17],[15,22,27],[16,9,4],[16,15,14],[16,17,18],[16,23,28],[17,10,5],[17,16,15],[17,18,19],[17,24,29],[18,17,16],[19,18,17],[20,13,6],[20,21,22],[21,14,7],[21,22,23],[22,15,8],[22,21,20],[22,23,24],[22,27,30],[23,16,9],[23,22,21],[23,24,25],[23,28,31],[24,17,10],[24,23,22],[24,25,26],[24,29,32],[25,18,11],[25,24,23],[26,19,12],[26,25,24],[27,22,15],[27,28,29],[28,23,16],[29,24,17],[29,28,27],[30,27,22],[30,31,32],[31,28,23],[32,29,24],[32,31,30]];
        
        //guardar o index do movimento juntos. [de, meio, para, index do movimento]
        board.validMoves.forEach(function(m, mi){ mi = mi.toString(); mi = mi.length == 1 ? '0'+mi : mi; m.push(mi); }); 
        
        board.validMovesNow = function() {
            var moves = [];
            board.forEach(function(spot) {moves = moves.concat(spot.validMovesNow());});
            return moves;
        }
        
        board.validMovesIndexNow = function() {
            return board.validMovesNow().map(function(m){ return m[3]; });
        }
        
        board.forEach(function(spot, i){ 
            //Adiciona o deslocamento para centralizar o círculo
            spot.x += dslotw, spot.y += dsloth,
            
            //Determina que o slot 16 está vazio incialmente 
            spot.state = i==16 ? 'empty' : '';
            
            //Movimentos válidos deste slot
            spot.validMoves = board.validMoves.filter(function(m) { return i==m[0] });
            
            //Função que determina os movimentos válidos no estado atual
            spot.validMovesNow = function(){ return spot.validMoves.filter(function(m){ 
                return !board[m[0]].empty() && !board[m[1]].empty() && board[m[2]].empty() 
            }) };
            
            spot.empty = function(){return spot.state == 'empty' || spot.state == 'destination';}
            
            spot.destination = function(){return spot.state == 'destination';}
            
            spot.selected = function(){return spot.state == 'selected';}
            
            spot.cleanState = function() { 
                switch(spot.state) {
                    case 'selected': 	spot.state = ''; 	  break;
                    case 'destination': spot.state = 'empty'; break;
                } 
            }
            
            spot.runMove = function(m) { /*spot é o destinatário*/
            	var m = m || spot.refMove;
            	
            	if (board[m[0]].validMovesNow().indexOf(m) > -1) {
            		spot.state = '';
            		board[m[1]].state = 'empty';
            		board[m[0]].state = 'empty';
            		var moveIndex = board.validMoves.indexOf(m);
            		board.sequence.push(moveIndex);
                    return true;
            	}
            	else {
            		//console.log('Este movimento não pode ser executado agora. ', m.toString());
                    return false;
            	} 
            }
        });
        
        board.sequence = new Resta1.Sequence();
        
        board.score = function() { return 32 - board.sequence.length; }
        
        
        board.cleanState = function() {
        	board.forEach(function(spot) { spot.cleanState(); });
        }
        
        board.selectedSpot = function() {
        	return board.filter(function(spot) { return spot.selected() })[0];
        }
        
        board.selectSpot = function(spot) {
        	spot.state = 'selected';
        	spot.validMovesNow().forEach(function(m) {
        		board[m[2]].state = 'destination';
        		board[m[2]].refMove = m;
        	});
        }


        board.runSequence = function(seqStr) {
            var seqArr = new Resta1.Sequence(seqStr);
            
            seqArr.forEach(function(mi){
                var m = board.validMoves[parseInt(mi)];
                board[m[2]].runMove(m);
            });
            
            updateView();
        } 
        
        
        board.runSequenceAnimated = function(seqStr) {
            var seqArr = new Resta1.Sequence(seqStr);
            
            seqArr.forEach(function(mi,i){
                    setTimeout(function(){
                        var m = board.validMoves[parseInt(mi)];
                        board[m[2]].runMove(m);
                        updateView();
                    }, 500*i);
                });
        }
        
        
        board.undoLastMove = function() {
            if (board.sequence.length > 0) {
                var lastMove = board.validMoves[board.sequence.pop()];
                board[lastMove[2]].state = 'empty';
        		board[lastMove[1]].state = '';
        		board[lastMove[0]].state = '';
                updateView();
        	}
        }
        
        
        board.reset = function() {
            board.forEach(function(spot, i){ spot.state = i==16 ? 'empty' : ''; });
            board.sequence = new Resta1.Sequence();
            updateView();
        }
            
        
        var view = (function createView() {
            if (config.noView) return;
            
            var svg = d3.select(config.container).append("svg")
            		  .attr("width", width)
            		  .attr("height", height);
            
            	
            var g = svg.selectAll("g.node")
            	.data(board).enter()
            	.append("svg:g")
            	.attr("class", "node")
            	.attr("transform", function(d) { return "translate(" + d.x + ","+ d.y + ")"; })
            	.on('click', function(spot){ 
            	if (spot.destination()) {
            		//execuar ação de comer
            		spot.runMove();
            		board.cleanState();
            		updateView();
            	}
            	else if (spot.empty()) {
            		//não faz nada
            	}
            	else {
            		//limpa estado e seleciona
            		board.cleanState();
            		board.selectSpot(spot);
            		updateView();
            	}
            });
            
            g.append("svg:circle")
            	.attr("class", function(spot) { return spot.state; })
            	.attr("r", radius)
            	
            if (config.compactView) {
                svg.append("svg:text")
                    .attr("x", width-21)
                    .attr("y", height-10)
                    .attr("class", 'score')
                	.text(function() { return board.score().toString()});
            }
            else {
                g.append("svg:text")
                    .attr("x", "-0.5em")
                	.attr("dy", ".31em")
                	.text(function(d, i) { return i.toString().length == 1 ? '0'+i : i; });
                    
                svg.append("svg:text")
                    .attr("x", width-100)
                	.attr("y", height-30+'px')
                	.attr("class", 'score')
                	.text(function() { return 'Resta ' + board.score()});
                
                svg.append("svg:text")
                    .attr("x", 30)
                    .attr("y", height-30+'px')
                    .attr("class", 'solucoes')
                	.text(function() { return ''; });
                
                svg.append("svg:text")
                    .attr("x", width-100)
                    .attr("y", 30+'px')
                    .attr("class", 'resetButton')
                    .text('Reset')
                    .on("click", function() { board.reset(); });
            }
                            
            return svg;
        })();
        	  
        	
        
        function updateView() {
            if (config.noView) return;
            
        	view.selectAll("circle")
        		.data(board)
        		.attr("class", function(d) { return d.state; });
        	
            if (config.compactView) {
            	view.select(".score")
            		.text(function() { return board.score().toString()});
            }
            else {
                view.select(".score")
                	.text(function() { return 'Resta ' + board.score()});
                    
                if (board.score() == 1) 
                    view.select(".solucoes").text('tu é o cara!');
                else if (board.score() < 13) {
                    board.buscarSolucao(board.sequence.toString(), function(solucoes){
                        view.select(".solucoes")
                            .text('Há x soluções'.replace('x', solucoes.length));
                            
                        console.log(solucoes);
                    });
                }
                else {
                    if (board.workerBusca) board.workerBusca.terminate();
                    view.select(".solucoes").text('');
                }
            }
        } 

        
        board.buscarSolucao = function(sequencia, handleSolucoes) {
        
            if (board.workerBusca) board.workerBusca.terminate();
            
            board.workerBusca = new Worker('js/src/BuscaWebWorker.js');
        
            board.workerBusca.addEventListener('message', function(e) {
        
                if (e.data.solucoes)
            		handleSolucoes(e.data.solucoes);
                else
                    console.log(e.data);
              
            }, false);
        
            board.workerBusca.onerror = function(event){
                console.error(event);
            };
            
            board.workerBusca.postMessage({sequenciaInicial: sequencia, noCentro: true});
        }

        board.runSequence(config.sequence);
        
        return board;
    },
    
    
    Sequence : function(seqStr) {
        if (typeof(seqStr) == 'string')  {
            var seqArr = seqStr.match(/.{2}/g);
            for (var i=0; i<seqArr.length; this.push(seqArr[i++]));
        }
            
        this.toString = function() { return this.map(function(mi){ mi = mi.toString(); return mi.length == 1 ? '0'+mi : mi }).join('').toString(); }
    },
    
}


Resta1.Sequence.prototype = new Array;