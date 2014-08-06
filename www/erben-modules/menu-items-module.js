var app = angular.module('myApp', []);

var validate_count = 0;
var order_id = window.localStorage.getItem("order_id");
var table_no = window.localStorage.getItem("table_no");

function setHref(val_id) {
	window.location = "gallery-detail.html?item_id=" + val_id;
}

//Load the menu list
var place_order = window.localStorage.getItem("place_order");
var user_id = window.localStorage.getItem("user_id");

app.controller('MainCtrl', function($scope, $http,$rootScope, $location) {
	
	$scope.init = function () {
		if(order_id == null || order_id == ""){
  			window.location = "start-order.html";
    	}else{
			if (place_order == "true") {
				document.getElementById("place_button").value = "Order is placed";
				document.getElementById("place_button").disabled = true;
			} else {
				document.getElementById("place_button").value = "Place your Order";
			}
		}
	};
	
  	$http({
	  method: 'JSONP',
	  url: 'http://councilofcoders.com/phonegap/get_menu_items.php?callback=JSON_CALLBACK'
	}).success(function(data, status , header, config){
		$scope.items=data;
		$scope.ordered=place_order;
		$scope.tableNo=table_no;
	
		$scope.update_cart = function(uitem_id) {
			if (place_order != "false") {
				document.getElementById("loading").style.display = "block";
				var pass_id = uitem_id;
				if (document.getElementById('chkbut' + uitem_id).checked == true) {
					var noItemsTemp = document.getElementById("noItems" + uitem_id).value;
					$http({
					  method: 'JSONP',
					  url: 'http://councilofcoders.com/phonegap/update_cart.php?jsoncallback=JSON_CALLBACK',
					  params: {itm_id : uitem_id, usr_id : user_id, noItemsPass : noItemsTemp}
					}).success(function(data, status , header, config){
						if (data.res == "1") {
							document.getElementById("resMsgError").innerHTML = "";
							document.getElementById("resMsg").innerHTML = "Update the order.";
							document.getElementById("loading").style.display = "none";
						}
					});
				}
			}
		};

		$scope.filterByName = function(item) {
			  if(!$scope.name) {
			    return true;
			  } else {
			    var keywords = $scope.name.toLowerCase().split(' ');
			
			    for(var i in keywords){
			        var k = keywords[i];
			        if (item.item_name.toLowerCase().indexOf(k) >= 0) {
			            return true;
			        }
			    }
			    return false;
			  }
		};
		
		$scope.filterByType = function(item) {
			  if(!$scope.mtype) {
			    return true;
			  } else {
			    var keywords = $scope.mtype.toLowerCase().split(' ');
			
			    for(var i in keywords){
			        var k = keywords[i];
			        if (item.menu_type.toLowerCase().indexOf(k) >= 0) {
			            return true;
			        }
			    }
			    return false;
			  }
		};
		
		$scope.add_item = function(uitem_id) {
			var noItemsTemp = document.getElementById("noItems" + uitem_id).value;
			$http({
			  method: 'JSONP',
			  url: 'http://councilofcoders.com/phonegap/add_to_cart.php?jsoncallback=JSON_CALLBACK',
			  params: {itm_id : uitem_id, usr_id : user_id, noItemsPass : noItemsTemp}
			}).success(function(data, status , header, config){
				if (data.res == "1") {
					document.getElementById("chkbut" + uitem_id).checked = true;
					document.getElementById("resMsgError").innerHTML = "";
					document.getElementById("resMsg").innerHTML = "Added to the order.";
	
					document.getElementById("loading").style.display = "none";
					validate_count++;
				}
			});
		};
		
		$scope.remove_item = function(uitem_id) {
			var noItemsTemp = document.getElementById("noItems" + uitem_id).value;
			$http({
			  method: 'JSONP',
			  url: 'http://councilofcoders.com/phonegap/remove_from_cart.php?jsoncallback=JSON_CALLBACK',
			  params: {itm_id : uitem_id, usr_id : user_id}
			}).success(function(data, status , header, config){
				if (data.res == "1") {
					document.getElementById("chkbut" + uitem_id).checked = false;
					document.getElementById("resMsgError").innerHTML = "";
					document.getElementById("resMsg").innerHTML = "Removed from the order.";
					document.getElementById("loading").style.display = "none";
					validate_count--;
				}
			});
		};
		
		$scope.change_the_cart = function(uitem_id) {
			if (place_order != "false") {
				if (document.getElementById("chkbut" + uitem_id).checked == true) {
					$scope.add_item(uitem_id);
				} else {
					$scope.remove_item(uitem_id);
				}
			}  
		};
		
		 $scope.check_item_available_in_cart = function(uitem_id) {
			$http({
			  method: 'JSONP',
			  url: 'http://councilofcoders.com/phonegap/check_cart.php?jsoncallback=JSON_CALLBACK',
			  params: {itm_id : uitem_id, usr_id : user_id}
			}).success(function(data, status , header, config){
				if (data.res == "1") {
					document.getElementById('chkbut' + uitem_id).checked = true;
					document.getElementById('noItems' + uitem_id).value = data.noOfItems;
					validate_count++;
				}else {
						document.getElementById('chkbut' + uitem_id).checked = false;
				}
			});
		};
		
		//run the check from cart function
		for(var i=0;i<$scope.items.length;i++){
			$scope.check_item_available_in_cart($scope.items[i].item_id);
		}
		
		 $scope.confirm_order = function() {
			window.location = "services.html";
		};
		
		$scope.place_order_func = function() {
			document.getElementById("loading").style.display = "block";
			if (window.validate_count != 0) {
				if (place_order == "true") {
					document.getElementById("place_button").value = "Order is placed.";
					document.getElementById("place_button").disabled = true;
		
				} else {
					window.localStorage.setItem("place_order", "true");
					$http({
					  method: 'JSONP',
					  url: 'http://councilofcoders.com/phonegap/cart_to_kitchen.php?jsoncallback=JSON_CALLBACK',
					  params: {user_id : user_id,order_id : order_id}
					}).success(function(data, status , header, config){
						document.getElementById("loading").style.display = "none";
						window.location = "services.html";
					});
				}
			}else {
				document.getElementById("resMsgError").innerHTML = "";
				document.getElementById("resMsg").innerHTML = "You have to select at least one item.";
			}
		};
	})
	.error(function(data, status , header, config){
	      console.log("error");
	});
	
});