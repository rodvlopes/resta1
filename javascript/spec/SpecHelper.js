beforeEach(function() {
  this.addMatchers({
    toBePlaying: function(expectedSong) {
      var player = this.actual;
      return player.currentlyPlayingSong === expectedSong
          && player.isPlaying;
    }
  })
});

SpecHelper = {
	executarMovimento : function(tabuleiro, movimento) {
		var de 		= movimento[0];
		var para 	= movimento[2];
		$elemDragged = $('td[data-spot="'+de+'"]');
		$elemDrop    = $('td[data-spot="'+para+'"]');
		tabuleiro.executar(movimento, $elemDragged, $elemDrop);
	}
}