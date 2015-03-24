var indexControllers = angular.module('indexControllers', ['services']);


var idx = window.location.href.lastIndexOf('/');
var baseURL = window.location.href.slice(0,idx+1);

var process = _.identity;
indexControllers.controller('GeneLists', ['$scope', '$http', 'loadExamples',
function($scope,$http,loadExamples){
		// $scope.fillInText = function(){
		// 	$http.get('data/example-genes.txt').success(function(data){
		// 		$scope.genes = data;
		// 	});
		// }
	$scope.geneLists = [];
	$scope.geneListCount = 0;
	$scope.allInputValid = false;
	$scope.moreThanOne = false;

	$scope.addGeneList = function(){
		$scope.geneLists.push({tag:"",genes:""});
		$scope.geneListCount += 1;
	}

	$scope.removeGeneList = function(){
		$scope.geneLists.pop();
		$scope.geneListCount -= 1;
	}

	$scope.fillInExamples = function(){
			loadExamples().then(function(data){
				var min = $scope.geneListCount < data.length ?
					$scope.geneListCount : data.length;
				for(var i=0; i<min; i++){
					$scope.geneLists[i].tag = data[i].tag;
					$scope.geneLists[i].genes = data[i].genes.join('\n');
				}
			})
	}

	$scope.addGeneList();

	$scope.$watch("geneLists",function(geneLists){
		$scope.allInputValid = _.every(geneLists,function(geneList){
			return geneList['genes'];
		});
	},true);

	$scope.$watch("geneListCount",function(geneListCount){
		if(geneListCount>1) $scope.moreThanOne = true;
		else $scope.moreThanOne = false;
	});

	// for test purpose
	// $scope.fillInText = function(){
	// 	var basePath = '../R/test/',
	// 		exampleInputs = [basePath+'ELK1-19687146-Hela cells-human.txt .n.txt',
	// 					basePath+'HSA04540_GAP_JUNCTION.txt .n.txt',
	// 					'data/example-genes-lite.txt']

	// 		$http.get('data/example-genes-lite.txt').success(function(data){
	// 			$scope.geneLists[0].genes = data;
	// 			$scope.geneLists[0].tag = "Enrichr Example";
	// 		});
	// }
	// $scope.fillInText();

	$scope.visualize = function(){
		console.log($scope.geneLists);
		if($scope.allInputValid){
			var input = _.map($scope.geneLists,function(geneList){
				var e = {};
				e.tag = geneList.tag;
				e.genes = _.unique(S(geneList.genes.toUpperCase())
				.trim().s.split("\n"));
				e.genes = _.map(e.genes,function(gene){
					return S(gene).trim().s;
				});
				return e;
			});

			$http.post(baseURL+"enrich",{input:input})
				.success(function(data) {
					window.location=baseURL+data;
			});
		}
	}
}]);
