angular.module('StockDeal.categories',['ui.router','toaster','ngAnimate'])
    .config(function($stateProvider,$urlRouterProvider){
        $stateProvider
            .state('categories',{
                url: '/categories',
                abstract: true,
                authenticate: true,
                resolve: {
                    categories: ['categories', function(categories){
                        return categories;
                    }]
                },
                views: {
                    'home-view': {
                        templateUrl: 'templates/main.html',
                        controller: function($scope, $state, categories){
                            $scope.categories = categories.all();
                            console.log($scope.categories);
                        }
                    }

                }
            })
            .state('categories.list',{
                url: '',
                authenticate: true,
                views:{
                    'list-view':{
                        templateUrl: 'src/categories/categories.list.html',
                        controller: ['$scope', '$stateParams', 'utils', '$state','categories','toaster',function ( $scope, $stateParams, utils, $state, categories,toaster) {
                            var Category = categories.category;
                            $scope.deleteCategory= function(id){
                                if(confirm('Voulez vous vraiment suppirmer cet categories')){
                                    Category.delete({_id: id},function (res) {
                                        if(res.status === 'error'){
                                            toaster.pop(res.status, null,res.message);
                                        }else{
                                            var obj = utils.findById($scope.categories,id);
                                            $scope.categories.splice($scope.categories.indexOf(obj),1);
                                            toaster.pop(res.status, null,res.message);
                                        }
                                    });
                                }
                                return false;
                            }
                        }]
                    }
                }
            })
            .state('categories.edit',{
                url: '/edit/{_id:[0-9a-z]{24}}',
                authenticate: true,
                views: {
                    'add-view': {
                        templateUrl: 'src/categories/categorie.add.html',
                        controller: ['$scope', '$stateParams', 'utils', '$state', 'toaster', 'categories', function($scope, $stateParams, utils, $state, toaster, categories){
                            $scope.focus = true;
                            $scope.category = categories.get($stateParams);
                            $scope.addCategory = function () {
                                $scope.category.$update(function(data){
                                    $scope.categories.splice($scope.categories.indexOf($scope.category),1);
                                    $scope.categories.push(data.cat);
                                    toaster.pop(data.status, null,data.message);
                                    $state.go('categories.list');
                                });
                            }
                        }]
                    }
                }
            })
            .state('categories.add',{
                url: '/add',
                authenticate: true,
                views: {
                    'add-view': {
                        templateUrl: 'src/categories/categorie.add.html',
                        controller: ['$scope','categories','$state','toaster', '$state', function($scope, categories, $state, toaster, $state){
                            $scope.category = new categories.category;
                            $scope.addCategory = function () {
                                $scope.category.$save(function (data) {
                                    $scope.categories.push(data.cat);
                                    toaster.pop(data.status, null,data.message);
                                    $state.go('categories.list');
                                });
                            }

                        }]
                    }
                }

            })


    });