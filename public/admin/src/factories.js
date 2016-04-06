angular.module('StockDeal.factories',[])
    .factory('Auth',['$http','API', '$q', function($http,API,$q){
        var factory = {
            login: function(admin){
                var deferred = $q.defer();
                $http.post(API.adminApi + '/login',admin)
                    .success(function(data){
                        deferred.resolve(data);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                return deferred.promise;
            },
            session: function(){
                var deferred = $q.defer();
                $http.get(API.adminApi + '/session')
                    .success(function(data){
                        deferred.resolve(data);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                return deferred.promise;
            },
            logout: function(){
                var deferred = $q.defer();
                $http.get(API.adminApi + '/logout')
                    .success(function(data){
                        deferred.resolve(data);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                return deferred.promise;
            }
        };
        return factory;
    }]);

