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



require(['AddColor','d3','jquery',
	'SaveSvg','LabelBox','Layout','Textify'],
	function(AddColor,d3,$,SaveSvg,LabelBox,Layout,Textify){


	var baseURL = window.location.protocol+"//"+window.location.host + "/rubik/";
	// grids is a global variable encoded in html
	var gridNamesNoOrder = Object.keys(grids);

	var preDefinedOrder = [
  				"ChEA",
  				// "ENCODE_TF_ChIP-seq",
  				"KEA",
  				// "Kinase_Perturbations_from_GEO",
  				// "Kinase_Perturbations_from_L1000",
  				"KEGG_new",
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

	// get a random key from an term obj.
	var termObj;
	for(var library in enrichments[0]){
		break;
	}
	for(var termName in enrichments[0][library]){
		termObj = enrichments[0][library][termName];
		break;
	}

	var addColor = new AddColor({gridNames:gridNames});
	var textify = new Textify({keys:Object.keys(termObj)});
	var labelBox = new LabelBox({selector:".labelBox",textify:textify});


	var layout = new Layout({addColor:addColor,gridNames:gridNames,
			grids:grids,labelBox:labelBox,enrichments:enrichments,
			tags:tags,textify:textify});

	if(tags.length==1) layout.single();
	else layout.compare();
	


	var saveSvg = new SaveSvg({baseURL:baseURL,gridsPerRow:2});
	$('button').click(function(){
		saveSvg.saveOne();
	});

});


