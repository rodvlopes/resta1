

importScripts('../lib/jquery/jquery.hive.pollen.js');
importScripts('Resta1.js', 'AG.js');

var e;
    
function iniciarAG() {
    
    var boardAg = new Resta1.Board({noView:true});
    
    var genes = [];
    for (var i=0; i< boardAg.validMoves.length; i++) { genes.push( i.toString().length == 1 ? '0'+i : i.toString() ); }
    
    var pesos = 
         [10,09,10,
          08,07,08,
    10,08,04,03,04,08,10,
    09,07,03,01,03,07,09,
    10,08,04,03,04,08,10,
          08,07,08,
          10,09,10]
    
    
    e = new AG.Execucao({
        genes : genes,
        tamanhoGenoma : 62,
        tamanhoPopulacao : 100,
        geracaoFinal : 200,
        periodoAmostra: 25,
        amostraHandler: function(amostra) { 
            self.postMessage({amostra: amostra});
        },
    
        funcaoAfinidade : function(individuo) { 
            var c = 0, peso = 0; 
            boardAg.reset();
            boardAg.runSequence(individuo.genoma);
            boardAg.forEach(function(spot, i){ /*c += spot.validMovesNow().length;*/ peso += spot.empty() ? pesos[i] : 0;}); 
            //return 5*(peso + 4*parseInt(c) + (33 - boardAg.score())) + individuo.diversidade;   
            return peso;
        }
     });
    
    //console.time('amostra');
    e.iniciar();
}



self.addEventListener('message', function(e) {
    if (e.data == 'inicia') {
        self.postMessage('ok');
        iniciarAG();
    }
}, false);