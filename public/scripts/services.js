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
			var map = {
				'c15':'EGFR/MEK1:BT20:24h',
				'c14':'PI3KA/mTOR:BT20:24h',
				'c9':'PI3KA/mTOR:HS578T:3h',
				'c10':'PI3KA/mTOR:HS578T:24h',
				'c1':'CHAPERONE:MCF7:24h',
				'c13':'PI3K/mTOR:MCF7:24h'
			};
			var inputs = _.map(order,function(tag){
				var elem = {};
				elem.tag = map[tag];
				elem.genes = data[tag].dn;
				return elem
			})
			deferred.resolve(inputs);
		});
		return deferred.promise;
    }
}]);
