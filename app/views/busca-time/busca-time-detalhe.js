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

	httpRequest.getJSON('https://api.cartolafc.globo.com/time/' + context.slug)
			.then(function(retorno) {
				detalhe.set('patrimonio', 'C$ ' + retorno.patrimonio.toFixed(2));
				detalhe.set('pontuacao', 'Pontuação: ' + retorno.pontos.toFixed(2) + ' pts');
			});
}