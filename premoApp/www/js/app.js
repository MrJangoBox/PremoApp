angular.module('premoApp', ['ionic', 'premoApp.controllers', 'premoApp.services', 'growlNotifications', 'ngCordova'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
    
    // All the paths of the different application views and related controllers
    .config(function ($stateProvider, $urlRouterProvider) {
        // uiGmapGoogleMapApiProvider.configure({
        //     //    key: 'your api key',
        //     v: '3.20', //defaults to latest 3.X anyhow
        //     libraries: 'weather,geometry,visualization'
        // })
        $stateProvider
            .state('auth', {
                url: "/auth",
                abstract: true,
                templateUrl: "templates/auth.html"
            })
            .state('auth.signin', {
                url: '/signin',
                views: {
                    'auth-signin': {
                        templateUrl: 'templates/auth-signin.html',
                        controller: 'SignInCtrl'
                    }
                }
            })
            .state('auth.signup', {
                url: '/signup',
                views: {
                    'auth-signup': {
                        templateUrl: 'templates/auth-signup.html',
                        controller: 'SignUpCtrl'
                    }
                }
            })
            .state('base', {
                url: "/base",
                abstract: true,
                templateUrl: "templates/base.html"
            })
            .state('base.list', {
                url: '/list',
                views: {
                    'base-list': {
                        templateUrl: 'templates/base-list.html',
                        controller: 'myListCtrl'
                    }
                }
            })
            .state('base.category', {
                url: '/category',
                views: {
                    'base-list': {
                        templateUrl: 'templates/base-category.html',
                        controller: 'categoryCtrl'
                    }
                }
            })
            .state('base.map', {
                url: '/map',
                views: {
                    'base-map': {
                        templateUrl: 'templates/base-map.html',
                        controller: 'mapCtrl'
                    }
                }
            })
            .state('base.topic', {
                url: '/topic',
                views: {
                    'base-list': {
                        templateUrl: 'templates/base-addevent.html',
                        controller: 'categoryCtrl'
                    }
                }
            })
            .state('base.description', {
                url: '/description',
                views: {
                    'base-description': {
                        templateUrl: 'templates/base-description.html',
                        controller: 'myListCtrl'
                    }
                }
            })
        $urlRouterProvider.otherwise('/auth/signin');
    });