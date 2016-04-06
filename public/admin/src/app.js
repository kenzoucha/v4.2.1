angular.module('StockDeal',[
    'StockDeal.products',
    'StockDeal.products.service',
    'StockDeal.categories',
    'StockDeal.categories.service',
    'StockDeal.scategories',
    'StockDeal.scategories.service',
    'StockDeal.utils.service',
    'StockDeal.controllers',
    'StockDeal.directives',
    'StockDeal.filters',
    'StockDeal.factories',
    'ngResource',
    'ngMessages',
    'ui.router',
    'ngFileUpload',
])
.constant('API',{
        adminApi: '/api/admin'
})
.run(function($rootScope, $state, Auth){
    $rootScope.$on('$stateChangeStart', function(event, toState){
        Auth.session().then(function(data){
            $rootScope.auth = data.auth;
            if(toState.authenticate && !data.auth){
                $state.transitionTo('login');
                event.preventDefault();
            }
        })
    })
})
.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('home', {
            url: '/',
            authenticate: true,
            template: '<h4>Bienvenu dans l\'espace administration de site Stock Deal</h4>'
        })
        .state('logout',{
            url: '/logout',
            authenticate: true,
            views: {
                'home-view': {
                    controller: function(Auth,toaster,$state,$rootScope){
                        Auth.logout().then(function(data){
                            toaster.pop(data.status, null,data.message);
                            $state.transitionTo('login');
                        });
                    }
                }

            }
        })
        .state('login',{
            url: '/login',
            authenticate: false,
            views: {
                'home-view': {
                    templateUrl: 'templates/login.html',
                    controller: function($scope,Auth,$state,toaster){
                        $scope.login = function(){
                            Auth.login($scope.admin).then(function(data){
                                if(data.status === 'error'){
                                    toaster.pop(data.status, null,data.message);
                                }else{
                                    toaster.pop(data.status, null,data.message);
                                    $state.transitionTo('home');
                                }
                            });

                        }
                    }
                }
            }
        })
}]);

