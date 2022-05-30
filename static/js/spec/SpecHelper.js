beforeEach(function() {
  this.addMatchers({
    toBePlaying: function(expectedSong) {
      var player = this.actual;
      return player.currentlyPlayingSong === expectedSong
          && player.isPlaying;
    },
		
		toBeTypeOf: function(expectedType) {
      var element = this.actual;
      return typeof(element) == expectedType;
    }
  })
});
