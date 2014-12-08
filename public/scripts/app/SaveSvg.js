define(['underscore','backbone','d3','jquery','S'],function(_, Backbone, d3,$,S){

function SaveSvg(args){
	this.baseURL = args.baseURL||'http://127.0.0.1:8080/grids/';
	this.gridsPerRow = args.gridsPerRow||2;
}


var saveSvgMethods = {
	save:function(){
		// save each grid into a svg file and zip them.
		var svgStrings = {};
		d3.selectAll('[name=gridContainer]').each(function(d,i){
			// inner html.
			var container =  d3.select(this);
			svgStrings[container.attr('id')] = container.html();

		});

		var self = this;

		$.post(this.baseURL+'saveSvg',svgStrings,function(data){
				document.location = self.baseURL+'downloadSvg?id=' + data;
		});
	},

	saveOne:function(){
		// save all svg grids to one svg file.
		var width = parseFloat($('svg').eq(0).attr('width'));
		var margin = width/10;
		var svg = $(document.createElementNS('http://www.w3.org/2000/svg','svg'));
		var gridsPerRow = this.gridsPerRow;

		var gridTranslate = {};
		gridTranslate.x = function(idx){return (idx%gridsPerRow)*(width+margin);}
		gridTranslate.y = function(idx){return (Math.floor(idx/gridsPerRow))*(width+margin*1.2);}

		$('svg').each(function(i){
			var g = $('svg').eq(i).find('g').eq(1)
											.clone() // clone so that not interrupting grid on page
											.attr('transform','translate('+gridTranslate.x(i)+','+
												gridTranslate.y(i)+')');

			var gridName = $('svg').eq(i).parent().attr('id');
			var gridTitle = S(gridName).replaceAll('_',' ').s;
			
			var titleElement = '<text transform="translate({{x}},{{y}})" font-szie="{{fontSize}}">{{gridTitle}}</text>';
			var defaultValues = {gridTitle:gridTitle,x:3,y:-5.56,fontSize:20.25};
			g.append(S(titleElement).template(defaultValues).s);
			svg.append(g);

		});

		var self = this;
		$.post(this.baseURL+'saveOneSvg',{svg:svg.html()},function(data){
			document.location = self.baseURL+'downloadSvg?id=' + data;
		});

	},
}


_.extend(saveSvgMethods,Backbone.Events);
_.extend(SaveSvg.prototype,saveSvgMethods);


return SaveSvg;

});