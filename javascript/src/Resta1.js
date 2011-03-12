var Resta1 = {

	Movimentos : function () {
		this.movimentos = [['01','02','03'],['03','02','01'],['02','03','04'],['04','03','02'],['03','04','05'],['04','05','06'],['05','04','03'],['05','06','07'],['06','05','04'],['07','06','05']];

		this.ehValido = function(de, para) {
			for (var i in this.movimentos) {
				var m = this.movimentos[i];
				if (m[0]==de && m[2]==para) { return m; }
			}
			return false;
		}
	}
}