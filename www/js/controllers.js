angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$http) {
	
	$scope.loyalCards = {name:"KFC",points:12,ratings:3,address:"Colombo"};
	$scope.number = 5;
	$scope.getNumber = function(num) {
	    return new Array(num);   
	};
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope,$window) {
            $scope.supportsGeo = $window.navigator;
            $scope.position = null;
            $scope.doTest1 = function() {
            window.navigator.geolocation.getCurrentPosition(function(position) {
                                                            $scope.$apply(function() {
                                                                          $scope.position = position;
                                                                          });
                                                            }, function(error) {
                                                            alert(error);
                                                            });
            };
            $scope.doTest2 = function() {
            $window.navigator.geolocation.getCurrentPosition(function(position) {
                                                             $scope.$apply(function() {
                                                                           $scope.position = position;
                                                                           });
                                                             }, function(error) {
                                                             alert(error);
                                                             });
            };
            
            
            
})

.controller('LoginCtrl', function($scope, $firebaseSimpleLogin,$state,$window) {
	
	$scope.loginData = {};

  var dataRef = new Firebase("https://map-objects.firebaseio.com/");
  $scope.loginObj = $firebaseSimpleLogin(dataRef);

  $scope.tryLogin = function() {
    $scope.loginObj.$login('facebook').then(function(user) {
    	console.log(user);
      var dataAuthRef = new Firebase(BASE+'users/');
		// Log me in
		dataAuthRef.auth(user.firebaseAuthToken, function(error, result) {
		  if (error) {
		    console.log('Login Failed!', error);
		  } else {
                         alert("d");
            $scope.supportsGeo = $window.navigator;
                         
            $window.navigator.geolocation.getCurrentPosition(function(position) {
                                                                          $scope.$apply(function() {
                         
            var picture = "http://graph.facebook.com/"+user.thirdPartyUserData.id+"/picture?type=large";
		  	dataAuthRef.child(user.thirdPartyUserData.id).set({name:user.thirdPartyUserData.name,email:user.thirdPartyUserData.email,fblink:user.thirdPartyUserData.link,lat:position.coords.latitude,lng:position.coords.longitude,iosToken:"2",photo:picture,gender:user.thirdPartyUserData.gender,notifications:"1",checkinButton:"1",type:"ios"});
                                                                                        
                $state.go('tab.dash');
                                                                                        
                                                                                        });
                                                             }, function(error) {
                                                             alert(error);
                                                             });
		  }
		});
    }, function(error) {
      // Show a form error here
      console.error('Unable to login', error);
    });
  };

});