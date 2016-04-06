angular.module('StockDeal.scategories',['ui.router','toaster','ngAnimate'])
    .config(function($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('scategories', {
                url: '/scategories',
                authenticate: true,
                abstract: true,
                resolve: {
                    scategories: ['scategories', function (scategories) {
                        return scategories;
                    }]
                },
                views: {
                    'home-view': {
                        templateUrl: 'templates/main.html',
                        controller: function($scope, scategories){
                            $scope.scategories = scategories.all();
                        }
                    }
                }
            })
            .state('scategories.list', {
                url: '',
                authenticate: true,
                views: {
                    'list-view':{
                        templateUrl: 'src/scategories/scategories.list.html',
                        controller: ['$scope', '$stateParams', 'utils', '$state', 'scategories', 'toaster', function ($scope, $stateParams, utils, $state, scategories, toaster) {
                            var SCategory = scategories.scategory;
                            $scope.deleteSCategory = function (id,index) {
                                if (confirm('Voulez vous vraiment suppirmer cet categories')) {
                                    SCategory.delete({_id: id}).$promise.then(function (res) {
                                        if (res.status === 'error') {
                                            toaster.pop(res.status, null, res.message);
                                        } else {
                                            $scope.scategories.splice(index, 1);
                                            toaster.pop(res.status, null, res.message);
                                        }
                                    })
                                }
                                return false;
                            }
                        }]
                    }
                }
            })


            .state('scategories.edit', {
                url: '/edit/{_id:[0-9a-z]{24}}',
                authenticate: true,
                views: {
                    'edit-view': {
                        templateUrl: 'src/scategories/scategorie.add.html',
                        controller: ['$scope', '$stateParams', 'scategories', '$state','categories','toaster', function ($scope, $stateParams, scategories, $state, categories, toaster) {
                            $scope.focus = true;
                            $scope.categories = categories.all();
                            scategories.get($stateParams).$promise.then(function(data){
                                $scope.scategory = new scategories.scategory({
                                    designation: [data.designation, 'text'],
                                    description: [data.description, 'textarea'],
                                    category: [data._categoryId, 'select'],
                                    _id     : data._id
                                });
                                $scope.addSCategory = function () {
                                    $scope.scategory.$update(function(data){
                                        $scope.scategories.splice($scope.scategories.indexOf($scope.scategory),1);
                                        $scope.scategories.push(data.scat);
                                        toaster.pop(data.status, null,data.message);
                                        $state.go('scategories.list');
                                    });
                                }
                            })
                        }]
                    }}
            })

            .state('scategories.add', {
                url: '/add',
                authenticate: true,
                views:{
                    'add-view' :{
                        templateUrl: 'src/scategories/scategorie.add.html',
                        controller: ['$scope', 'scategories', '$state', 'toaster', 'categories', 'utils', function ($scope, scategories, $state, toaster, categories, utils) {
                            $scope.categories = categories.all();
                            $scope.scategory = new scategories.scategory({
                                designation: ['', 'text'],
                                description: ['', 'textarea'],
                                category: ['', 'select']
                            });
                            console.log($scope.scategory);
                            $scope.addSCategory = function(){
                                $scope.scategory.$save(function(data){
                                    $scope.scategories.push(data.scategory);
                                    if(data.status === 'error'){
                                        toaster.pop(data.status, null,data.message);
                                    }else{
                                        toaster.pop(data.status, null,data.message);
                                        $state.go('scategories.list');
                                    }
                                });
                            };
                        }]
                    }
                }

            });
    });