angular.module('StockDeal.products.service',[])
.factory('products',['$resource','API', function($resource, API){
        var Product = $resource(API.adminApi + '/product/:id',null,{
            'update': {method: 'PUT', params: {id: '@id'}}
        });
        var factory = {};
        factory.all = function(){
            return Product.query();
        }
        factory.get = function(id){
            return Product.get(id);
        }
        factory.product = Product;

        return factory;
}]);


