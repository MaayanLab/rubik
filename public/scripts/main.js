requirejs.config({

baseUrl: 'scripts/app',

paths: {
	underscore: "../lib/underscore-min",
	backbone: "../lib/backbone-min",
	d3: "../lib/d3.min",
	"jquery-base": "../lib/jquery-1.8.2.min",
	math: "../lib/math.min",
	Util:"../lib/Util",
	S:"../lib/string.min",
	"jquery":"../lib/jquery-ui-tooltip-customized"
},

shim:{

	'backbone':{
		deps:['underscore','jquery-base'],
		exports: 'Backbone'
	},

	'underscore':{
		exports:'_'
	},

	'jquery':{
		exports:'$',
		deps:['jquery-base']
	},

	'd3':{
		exports:'d3'
	},

	'math':{
		exports:'math'
	},


}

});



require(['CanvasForGrids','AddColor','d3','jquery','SaveSvg','LabelBox','Layout'],
	function(Canvas,AddColor,d3,$,SaveSvg,LabelBox,Layout){


	var baseURL = window.location.protocol+"//"+window.location.host + "/grids/";
	// grids is a global variable encoded in html
	var gridNamesNoOrder = Object.keys(grids);

	var preDefinedOrder = [
  				"ChEA",
  				// "ENCODE_TF_ChIP-seq",
  				"KEA",
  				// "Kinase_Perturbations_from_GEO",
  				// "Kinase_Perturbations_from_L1000",
  				"KEGG",
  				"WikiPathways",
  				"GO_Biological_Process",
  				"MGI_Mammalian_Phenotype_Level_4",

  				// "GO_Molecular_Function",
  				
		];

	var gridNames = [];

	preDefinedOrder.forEach(function(e){
		if(gridNamesNoOrder.indexOf(e)>-1)
			gridNames.push(e);
	});


	var addColor = new AddColor({gridNames:gridNames});
	var labelBox = new LabelBox({selector:".labelBox"});


	var layout = new Layout({addColor:addColor,gridNames:gridNames,
			grids:grids,labelBox:labelBox,enrichments:enrichments,tags:tags});

	if(tags.length==1) layout.single();
	else layout.compare();
	


	var saveSvg = new SaveSvg({baseURL:baseURL,gridsPerRow:2});
	$('button').click(function(){
		saveSvg.saveOne();
	});

});


