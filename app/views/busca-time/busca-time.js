var httpRequest = require("http");
var view = require("ui/core/view");
var dialogs = require("ui/dialogs");
var framesModule = require("ui/frame");
var observableModule = require("data/observable");
var observableArrayModule = require("data/observable-array");

var model = new observableModule.Observable();
var _page;

model.times = new observableArrayModule.ObservableArray([]);

exports.pageLoaded = function(args) {
	_page = args.object;
	
	resetModel();
	_page.bindingContext = model;
};

exports.buscarTime = function() {
	var time = view.getViewById(_page, "time");

	if (time.text !== '') {
		resetModel();
		
		carregaTimes(time.text);
	}
};

exports.itemTap = function(args) {
	var item = model.times.getItem(args.index);
	framesModule.topmost().navigate({
		moduleName: '/views/busca-time/busca-time-detalhe',
		context: item
	});
};

function carregaTimes(time) {
	var activityIndicator = view.getViewById(_page, "activityIndicator");
    activityIndicator.busy = true;

	httpRequest.getJSON('https://api.cartolafc.globo.com/times?q=' + time)
			.then(function(retorno){
				activityIndicator.busy = false;
				retorno.forEach(function(item){
					model.times.push({
						escudo: item.url_escudo_png,
						time:  item.nome,
						nome: item.nome_cartola,
						slug: item.slug
					});
				});
			}, function(e){
				activityIndicator.busy = false;
				var options = {
				    title: "Nenhum Time",
				    message: "Nenhum time encontrado",
				    okButtonText: "OK"
				};
				dialogs.alert(options).then(function () {
				    console.log("Não foi possível encontrar o time!");
				});
			});
}

function resetModel() {
	while (model.times.length) {
		model.times.pop();
	}
}