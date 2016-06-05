var httpRequest = require("http");
var observableModule = require("data/observable");
var detalhe = new observableModule.Observable();

var _page;

exports.pageLoaded = function(args) {
	_page = args.object;
	_page.bindingContext = detalhe;

	carregaDetalhe();
};

function carregaDetalhe() {
	var context = _page.navigationContext;
	
	detalhe.set('escudo', context.escudo);
	detalhe.set('time', context.time);
	detalhe.set('nome', 'Técnico: ' + context.nome);

	httpRequest.getJSON('http://api.cartola.globo.com/time_adv/' + context.slug + '.json')
			.then(function(retorno) {
				detalhe.set('patrimonio', 'C$ ' + retorno.time.patrimonio.toFixed(2));
				detalhe.set('pontuacao', 'Pontuação: ' + retorno.time.pontuacao + ' pts');
			});
}