angular.module('premoApp.services', [])

.factory('API', function ($rootScope, $http, $ionicLoading, $ionicSideMenuDelegate, $window) {

    // For local development
     var base = "http://localhost:9804";

    // For online development
    //   var base = "http://sportpulse.herokuapp.com";

	if (ionic.Platform.isAndroid())
	{
		base = "http://192.168.0.196:9804";
	}
    
    $rootScope.show = function (text) {
        $rootScope.loading = $ionicLoading.show({
            content: text ? text : 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    };

    $rootScope.hide = function () {
        $ionicLoading.hide();
    };

    $rootScope.logout = function () {
        $rootScope.setToken("");
        $ionicSideMenuDelegate.canDragContent(false);
        $window.location.href = '#/auth/signin';
    };

    $rootScope.notify =function(text){
        $rootScope.show(text);
        $window.setTimeout(function () {
          $rootScope.hide();
        }, 1999);
    };

    $rootScope.doRefresh = function (tab) {
        if(tab == 1)
            $rootScope.$broadcast('fetchAll');
        else
            $rootScope.$broadcast('fetchCompleted');

        $rootScope.$broadcast('scroll.refreshComplete');
    };

    $rootScope.setToken = function (token) {
        return $window.localStorage.token = token;
    }

    $rootScope.getToken = function () {
        return $window.localStorage.token;
    }

    $rootScope.isSessionActive = function () {
        return $window.localStorage.token ? true : false;
    }

    return {
        signin: function (form) {
            return $http.post(base+'/api/v1/premoApp/auth/login', form);
        },
        signup: function (form) {
            return $http.post(base+'/api/v1/premoApp/auth/register', form);
        },
        getAllEvents: function (email) {
            return $http.get(base+'/api/v1/premoApp/data/list', {
                method: 'GET',
                params: {
                    token: email
                }
            });
        },
        getEventInfo: function (email, category) {
            return $http.get(base+'/api/v1/premoApp/data/topicList', {
                method: 'GET',
                params: {
                    token: email,
                    category: category
                }
            });
        },
        saveItem: function (form, email) {
            return $http.post(base+'/api/v1/premoApp/data/item', form, {
                method: 'POST',
                params: {
                    token: email
                }
            });
        }
    }
});