angular.module('premoApp.controllers', ['premoApp.services'])

// Navigation controller
.controller('ionNavCtrl', function($rootScope, $scope, $location, $ionicSideMenuDelegate) {

    console.log("location path: " + $location.path());

    $scope.isActive = function() {
        if($location.path() == "/auth/signin" || $location.path() == "/auth/signup") {
            $ionicSideMenuDelegate.canDragContent(false);
            return false;
        } else {
            $ionicSideMenuDelegate.canDragContent(true);
            return true;
        }
    };

    // $scope.goBack = function() {
    //     $ionicHistory.goBack(-1);
    // }

    $rootScope.$broadcast('fetchAll');
})

// Sign in controller
.controller('SignInCtrl', function ($rootScope, $scope, API, $ionicSideMenuDelegate, $window) {
    // $scope.menuButtonsHidden = false;

    // if the user is already logged in, take him to his PremoApp app
    if ($rootScope.isSessionActive()) {
        $window.location.href = ('#/base/list');
    }

    $scope.user = {
        email: "",
        password: ""
    };

    // $rootScope.showMenuButton = function () {
    //             return "false";
    //         };

    $scope.validateUser = function () {
        $rootScope.userNoMatch = false;
        $rootScope.emptyLoginCredit = false;

        var email = this.user.email;
        var password = this.user.password;

        if(!email || !password) {
            $rootScope.emptyLoginCredit = true;
            return false;
        }
        API.signin({
            email: email,
            password: password
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/base/list');
        }).error(function (error) {
            $rootScope.userNoMatch = true;
            $rootScope.hide();
        });
    }

})

// Sign up controller
.controller('SignUpCtrl', function ($rootScope, $scope, API, $window) {
    $scope.user = {
        email: "",
        password: "",
        passwordConf: "",
        firstName: "",
        lastName: ""
    };

    $scope.createUser = function () {
        $rootScope.emptySignupCredit = false;
        $rootScope.existingEmail = false;
        $rootScope.comunicationError = false;
        var email = this.user.email;
        var password = this.user.password;
        var passwordConfirmation =  this.user.passwordConf;
        var uFirstName = this.user.firstName;
        var uLastName = this.user.lastName;
        if(!email || !password || !uFirstName || uLastName || password != passwordConfirmation) {
            $rootScope.emptySignupCredit = true;
            return false;
        }

        $rootScope.show('Please wait.. Registering');
        API.signup({
            email: email,
            password: password,
            firstName: uFirstName,
            lastName: uFirstName
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.sideMenu = true;
            $rootScope.hide();
            $window.location.href = ('#/base/list');
        }).error(function (error) {
            $rootScope.hide();
            if(error.error && error.error.code == 11000)
            {
                $rootScope.existingEmail = true;
            }
            else
            {
                $rootScope.communicationError = true;
            }
            
        });
    }
})

// Treatment list controller
.controller('myListCtrl', function ($rootScope, $scope, $ionicSideMenuDelegate, API, $timeout, $ionicModal, $window) {
    $rootScope.$on('fetchAll', function(){
            API.getAllEvents($rootScope.getToken()).success(function (data, status, headers, config) {
            $rootScope.show("Please wait... Processing");
            $scope.list = [];
            $scope.itemsLoaded = [];
            for (var i = 0; i < data.length; i++) {
                $scope.eventExist = false;
                
                numOfItems = $scope.itemsLoaded.length;
                
                if (numOfItems == 0) {
                        $scope.itemsLoaded.push(data[i].eventId);
                        console.log(data[i].eventId);
                }

                for (var j = 0; j < numOfItems; j++) {    
                    
                    if (data[i].eventId == $scope.itemsLoaded[j])
                    {
                        $scope.eventExist = true;
                    }
                }
                
                if ($scope.eventExist == false)
                {
                    $scope.list.push(data[i]);
                    $scope.itemsLoaded.push(data[i].eventId);
                }
            };
            if($scope.list.length == 0)
            {
                $scope.noData = true;
            }
            else
            {
                $scope.noData = false;
            }
                
            $rootScope.hide();
        }).error(function (data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    });
    
    // $rootScope.showMenuButton = function () {
    //             return "true";
    //         };

    $rootScope.selectEvent = function (eventId, eventName) {
                console.log("ouchhh");
                $rootScope.eventId = eventId
                $rootScope.eventNameChosen = eventName
                $window.location.href="#/base/category"
                $scope.$broadcast("$destroy");
            };

    $rootScope.$broadcast('fetchAll');
 
})

// Category controller
.controller('categoryCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    $rootScope.$on('fetchAll', function(){
            API.getEventInfo($rootScope.getToken(),$rootScope.eventId).success(function (data, status, headers, config) {
            $rootScope.show("Please wait... Processing");
            $scope.eventInfos = [];
            for (var i = 0; i < data.length; i++) {
//                Code example for when there is a need  to separate loading parameters
//                if (data[i].isCompleted == false) {
                    $scope.eventInfos.push(data[i]);
//                }
            };
            if($scope.list.length == 0)
            {
                $scope.noData = true;
            }
            else
            {
                $scope.noData = false;
            }
 
            $ionicModal.fromTemplateUrl('templates/newItem.html', function (modal) {
                $scope.newTemplate = modal;
            });
 
            $scope.newTask = function () {
                $scope.newTemplate.show();
            };
                
            $rootScope.hide();
        }).error(function (data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    });
 
    $rootScope.selectTopic = function (topic, topicContent) {
                
                $window.location.href="#/base/topic"
                $rootScope.topic = topic
                $rootScope.topicContent = topicContent
            };
    
    $rootScope.$broadcast('fetchAll');
 
})

// Map controller
.controller('mapCtrl', function ($rootScope, $scope, $state, $cordovaGeolocation) {

    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        //Wait until the map is loaded
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){

            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });

            // console.log("Location parameter: " + latLng + " type: " + typeof latLng);
            // console.log("Latitude parameter: " + position.coords.latitude + " type of longitude: " + typeof position.coords.longitude);

            var infoWindow = new google.maps.InfoWindow({
                content: "Here I am!"
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
            });

        });

    }, function(error){
        console.log("Could not get location");
    });

    $rootScope.$broadcast('fetchAll');

})