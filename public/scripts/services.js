var services = angular.module('services', []);

services.factory('exampleURLs',[function(){
  return {

  }
}]).factory('loadGeneList',['$http','$q',function($http){
    return function(url){
      var deferred = $q.defer();
      $http.get(url).success(function(data){
				deferred.resolve(data);
			});
			return deferred.promise;
    }
}]).factory('loadExamples',['$http','$q',function($http,$q){
	return function(){
      var deferred = $q.defer();
      $http.get('data/LJP56Genes.json').success(function(data){
			var order = ['c15','c14','c1','c13','c9','c10'];
			var inputs = _.map(order,function(tag){
				var elem = {};
				elem.tag = tag;
				elem.genes = data[tag].dn;
				return elem
			})
			deferred.resolve(inputs);
		});
		return deferred.promise;
    }
}]);
