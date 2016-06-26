var httpRequest = require("http");
var observableModule = require("data/observable");
var observableArrayModule = require("data/observable-array");

var model = new observableModule.Observable();
var _page;

model.partidas = new observableArrayModule.ObservableArray([]);

exports.pageLoaded = function(args) {
	_page = args.object;
	var rodada = _page.navigationContext.rodada;
	
	_page.bindingContext = model;

	if (_page.ios) {
		var controller = _page.ios.navigationController;
		controller.navigationBarHidden = false;
		_page.ios.title = 'Rodada: ' + rodada;
	}

	carregaJogos(rodada);
};

function carregaJogos(rodada) {	
	resetModel();

	httpRequest.getJSON('https://api.cartolafc.globo.com/partidas')
		.then(function(retorno){
			var i = 0;
			retorno.partidas.forEach(function(item){
				model.partidas.push({
					local: item.local,
					clubeCasa: retorno.clubes[item.clube_casa_id].abreviacao,
					clubeCasaEscudo:retorno.clubes[item.clube_casa_id].escudos['60x60'],
					placarCasa: ' (' + item.placar_oficial_mandante + ') ',
					clubeVisitante: retorno.clubes[item.clube_visitante_id].abreviacao,
					clubeVisitanteEscudo: retorno.clubes[item.clube_visitante_id].escudos['60x60'],
					placarVisitante: ' (' + item.placar_oficial_visitante + ') '
				});
			});
		});
}

function resetModel() {
	while (model.partidas.length) {
		model.partidas.pop();
	}
}