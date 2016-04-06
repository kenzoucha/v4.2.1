angular.module('StockDeal.categories.service',[])
.factory('categories',['$resource','API', function($resource,API){
    var Category = $resource(API.adminApi + '/category/:_id',null,{
        'update': {method: 'PUT', params: {_id: '@_id'}}
    });
    var factory = {};
    factory.all = function(){
        return Category.query();
    }
    factory.get = function(id){
        return Category.get(id);
    }
    factory.category = Category;

    return factory;


}]);