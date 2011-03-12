describe("Resta1.Movimentos", function() {
  var movimentos;

  beforeEach(function() {
    movimentos = new Resta1.Movimentos();
		movimentos.movimentos = [['1', '2', '3'], ['4', '5', '6'], ['3', '2', '1']]
  });

	describe("ehValido?", function() {

	  it("deve retornar o movimento dado de,para", function() {
			movimento = movimentos.ehValido('1', '3');
	    expect(movimento).toEqual(['1', '2', '3']);
	  });
	
	  it("deve retornar false quando não encontrar um movimento com um de,para ", function() {
			movimento = movimentos.ehValido('3', '3');
	    expect(movimento).toBeFalsy();
	  });
	
	}); //describe
	
}); //describe