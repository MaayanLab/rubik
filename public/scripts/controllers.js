var indexControllers = angular.module('indexControllers', []);


var baseURL = window.location.protocol+"//"+window.location.host + "/sigine/";

var process = _.identity;
indexControllers.controller('GeneLists', ['$scope', '$http',function($scope,$http){
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
		$scope.geneLists.push({desc:"",genes:""});
		$scope.geneListCount += 1;
	}

	$scope.removeGeneList = function(){
		$scope.geneLists.pop();
		$scope.geneListCount -= 1;
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

		$scope.visualize = function(){
			console.log($scope.geneLists);
			// if($scope.genes){
			// 	var input = _.unique(S($scope.genes.toUpperCase())
			// 		.trim().s.split("\n"));
			// 	//trim unvisible char like \r after each gene if any
			// 	input = _.map(input,function(gene){
			// 		return S(gene).trim().s;
			// 	});
			// 	$http.post(baseURL+"query",{input:input})
			// 		.success(function(data) {
			// 		$scope.entries = process(data);
			// 	});
			// }
		}	
	}
]);