var indexControllers = angular.module('indexControllers', []);


var baseURL = window.location.protocol+"//"+window.location.host + "/rubik/";

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

	// for test purpose
	$scope.fillInText = function(){
			$http.get('data/example-genes-lite.txt').success(function(data){
				$scope.geneLists[0].genes = data;
				$scope.geneLists[0].desc = "Enrichr Example";
			});
	}
	$scope.fillInText();

	$scope.visualize = function(){
		console.log($scope.geneLists);
		if($scope.allInputValid){
			var input = _.map($scope.geneLists,function(geneList){
				var e = {};
				e.desc = geneList.desc;
				e.genes = _.unique(S(geneList.genes.toUpperCase())
				.trim().s.split("\n"));
				e.genes = _.map(e.genes,function(gene){
					return S(gene).trim().s;
				});
				return e;
			});

			$http.post(baseURL+"enrich",{input:input})
				.success(function(data) {
				console.log(data);
			});
		}
	}	
}]);