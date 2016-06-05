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
	var escudos = {
		"Coritiba" : "cfc",
		"Atlético-MG" : "cam",
		"Atlético-PR" : "cap"
	};
	
	resetModel();

	httpRequest.getJSON('http://api.cartola.globo.com/partidas/' + rodada + '.json')
		.then(function(retorno){
			retorno.partidas.forEach(function(item){
				var ce = escudos[item.clube_casa.nome] === undefined ? item.clube_casa.abreviacao.toLowerCase() : escudos[item.clube_casa.nome];
				var ve = escudos[item.clube_visitante.nome] === undefined ? item.clube_visitante.abreviacao.toLowerCase() : escudos[item.clube_visitante.nome];
				
				model.partidas.push({
					local: item.local,
					clubeCasa: item.clube_casa.abreviacao,
					clubeCasaEscudo: '~/images/escudos/' +  ce + '.png',
					clubeVisitante: item.clube_visitante.abreviacao,
					clubeVisitanteEscudo: '~/images/escudos/' + ve + '.png'
				});
			});
		});
}

function resetModel() {
	while (model.partidas.length) {
		model.partidas.pop();
	}
}