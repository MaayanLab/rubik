var services = angular.module('services', []);

services.factory('exampleURLs',[function(){
  return {

  }
}])
.factory('loadGeneList',['$http','$q',function($http){
    return function(url){
      var deferred = $q.defer();
      $http.get(url).success(function(data){
				deferred.resolve(data);
			});
			return deferred.promise;
    }
}]);
