angular.module('StockDeal.scategories.service',[])
    .factory('scategories',['$resource','API', function($resource,API){
        var SCategory = $resource(API.adminApi + '/scategory/:_id',null,{
            'update': {method: 'PUT', params: {_id: '@_id'}}
        });
        var factory = {};
        factory.all = function(){
            return SCategory.query();
        }
        factory.get = function(id){
            return SCategory.get(id);
        }
        factory.scategory = SCategory;

        return factory;


    }]);