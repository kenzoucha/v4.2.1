angular.module('StockDeal.filters',[])
    .filter('keyFilter', function(){
        return function(obj, query){
            var result = {};
            angular.forEach(obj, function(val, key){
                if(key !== query){
                    result[key] = val;
                }
            });
            return result;
        }
    })
    .filter('ArrayList', function(){
        return function(input){
            var a = input.split(' ');
            return a;
        }
    })