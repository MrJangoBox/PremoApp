angular.module('sauveApp.controllers', ['sauveApp.services'])
 
// Sign in controller
.controller('SignInCtrl', function ($rootScope, $scope, API, $window) {
    // if the user is already logged in, take him to his SauveApp app
    if ($rootScope.isSessionActive()) {
        $window.location.href = ('#/base/list');
    }
 
    $scope.user = {
        email: "",
        password: ""
    };
 
    $rootScope.showMenuButton = function () {
                return "false";
            };
    
    $scope.validateUser = function () {
        var email = this.user.email;
        var password = this.user.password;
        if(!email || !password) {
            $rootScope.notify("Please enter valid credentials");
            return false;
        }
        $rootScope.show('Please wait.. Authenticating');
        API.signin({
            email: email,
            password: password
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/base/list');
        }).error(function (error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }
 
})

// Sign up controller
.controller('SignUpCtrl', function ($rootScope, $scope, API, $window) {
    $scope.user = {
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    };

    $rootScope.showMenuButton = function () {
                return "false";
            };
 
    $scope.createUser = function () {
        var email = this.user.email;
        var password = this.user.password;
        var uFirstName = this.user.firstName;
        var uLastName = this.user.lastName;
        if(!email || !password || !uFirstName || uLastName) {
            $rootScope.notify("Please enter valid data");
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
            $rootScope.hide();
            $window.location.href = ('#/base/list');
        }).error(function (error) {
            $rootScope.hide();
            if(error.error && error.error.code == 11000)
            {
                $rootScope.notify("A user with this email already exists");
            }
            else
            {
                $rootScope.notify("Oops something went wrong, Please try again!");
            }
            
        });
    }
})

// Treatment list controller
.controller('myListCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    $rootScope.$on('fetchAll', function(){
            API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
            $rootScope.show("Please wait... Processing");
            $scope.list = [];
            $scope.categoriesLoaded = [];
            for (var i = 0; i < data.length; i++) {
                $scope.categoryExist = false;
                
                numOfCategories = $scope.categoriesLoaded.length;
                console.log(numOfCategories);
                
                if (numOfCategories == 0) {
                        $scope.categoriesLoaded.push(data[i].category);
                        console.log(data[i].category);
                }
                
                for (var j = 0; j < numOfCategories; j++) {    
                    
                    if (data[i].category == $scope.categoriesLoaded[j])
                    {
                        $scope.categoryExist = true;
                    }
                }
                
                if ($scope.categoryExist == false)
                {
                    $scope.list.push(data[i]);
                    $scope.categoriesLoaded.push(data[i].category);
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
    
    $rootScope.showMenuButton = function () {
                return "true";
            };
 
    $rootScope.selectCategory = function (category) {
                $window.location.href="#/base/category"
                $rootScope.category = category
                $scope.$broadcast("$destroy");
            };
    
    $rootScope.$broadcast('fetchAll');
 
})

// Category controller
.controller('categoryCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    $rootScope.$on('fetchAll', function(){
            API.getAllTopics($rootScope.getToken(),$rootScope.category).success(function (data, status, headers, config) {
            $rootScope.show("Please wait... Processing");
            $scope.topicList = [];
            for (var i = 0; i < data.length; i++) {
//                Code example for when there is a need  to separate loading parameters
//                if (data[i].isCompleted == false) {
                    $scope.topicList.push(data[i]);
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