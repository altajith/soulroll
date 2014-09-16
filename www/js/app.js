// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var BASE = "https://map-objects.firebaseio.com/";
angular.module('starter', ['ionic','firebase' ,'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,$rootScope, $firebaseSimpleLogin, $state, $window) {

  $ionicPlatform.ready(function() {
  	 
  var dataRef = new Firebase(BASE);
  var loginObj = $firebaseSimpleLogin(dataRef);

  loginObj.$getCurrentUser().then(function(user) {
    if(!user){ 
      // Might already be handled by logout event below
      
    	 alert("s");
      $state.go('login');
    }else{
    	 alert("s");
    	
    }
  }, function(err) {
  });

  $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
   $state.go('tab.dash');
  });

  $rootScope.$on('$firebaseSimpleLogin:logout', function(e, user) {
    console.log($state);
    $state.go('login');
  });
             
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    
	.state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl'
    })
    
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
	
    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })
    
    .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab.dash');

});

