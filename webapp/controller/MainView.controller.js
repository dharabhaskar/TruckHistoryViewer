sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
], function(Controller, MessageBox) {
	"use strict";
	var map;
	return Controller.extend("com.infocusTruckHistoryViewer.controller.MainView", {

		onInit: async function() {
			var _self = this;
			_self.base = "https://test-serv.movam.ng/api/v1";
			_self.trackingBase = "https://trackapidev.movam.ng/api/devices";

			var key2 = 'AIzaSyDNFTiOxDtjntYTjvlD89SdP8CHVptOp3A';
			var key1 = 'AIzaSyAsjidHqlFl7k0kmvv4sGmU5ngUFA-3m5k';

			//Add google api
			window.addEventListener('load', function() {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAsjidHqlFl7k0kmvv4sGmU5ngUFA-3m5k&avoid=TOLLS&libraries=places';
				document.body.appendChild(script);
			});

			//Add click event

			$(document).on("click", "#btnSubmit", function(event) {
				_self.onSubmitPress();
			});

			try {
				_self.token = await _self.getToken();
				//console.log(token);
				var vehcilesResp = await _self.getAllVehicles(_self.token);
				console.log(vehcilesResp);
				vehcilesResp.data.forEach(v => {
					var optionValue = v.id;
					var optionText = v.vehicleNo;
					$('#truckNo').append(
						`<option value="${optionValue}">
	                                       ${optionText}
	                                  </option>`
					)
				});
				_self.initMap();

			} catch (error) {
				console.log(error);
			}

			//Initial date values...
			$('#startDate').val('2021-11-09');
			$('#endDate').val('2021-11-09');

		},
		getToken: function() {
			var tokenUrl = this.base + "/get-token";
			var data = {
				"email": "movamtransporter@protonmail.com",
				"password": "12345678",
				"role": "transporter"
			};
			/*var data= {
				"email":"sumit@infocus-in.in",
				"password": "12345678",
				"role": "shipper"
			};*/
			return new Promise(function(resolve, reject) {
				$.ajax({
					url: tokenUrl,
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json"
					},
					data: JSON.stringify(data),
					success: function(response) {
						if (response.statusCode !== 200) {
							reject(response.message);
							return
						}
						var token = response.data.token;
						//console.log(token);
						resolve(token);
					},
					error: function(err) {
						reject(err);
					}
				});
			});
		},
		getBacktraking: function(token, data) {
			var url = this.trackingBase + "/backtracking";
			/*var data = {
				"vehicleId": data.truckNo,
				"fromDate": data.startDate,
				"toDate": data.endDate
			};*/
			return new Promise(function(resolve, reject) {
				$.ajax({
					url: url,
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json",
						"Authorization": "Bearer " + token
					},
					data: JSON.stringify(data),
					success: function(response) {
						//var token = response.data.token;
						console.log(response);
						if (response.status == 200) {
							var locations = response.data.map(l => {
								return {
									lat: l.latitude,
									lng: l.longitude
								}
							});
							/*locations = locations.filter(function(item, pos) {
								return locations.map(l => l.lat).indexOf(item.lat) == pos
							})*/
							resolve(locations);
						} else {
							reject(response.message);
							return
						}
					},
					error: function(err) {
						reject(err);
					}
				});
			});
		},
		getAllVehicles: function(token) {
			var vehiclesApiUrl = this.base + "/vehicles";
			return new Promise(function(resolve, reject) {
				$.ajax({
					url: vehiclesApiUrl,
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json",
						"Authorization": "Bearer " + token
					},
					success: function(response) {
						if (response.statusCode !== 200) {
							reject(response.message);
							return
						}
						resolve(response);
					},
					error: function(err) {
						reject(err);
					}
				});
			});
		},
		getFormData: function() {
			var data = {};
			data.fromDate = $("#startDate").val();
			data.toDate = $("#endDate").val();
			data.vehicleId = $("#truckNo").val();

			var isValid = true;
			var msg = '';
			if (data.fromDate == '') {
				msg += 'Please select a start date.\n';
				isValid = false;
			}
			if (data.toDate == '') {
				msg += 'Please select a end date.\n';
				isValid = false;
			}
			if (data.vehicleId == '') {
				msg += 'Please select a vehicle.\n';
				isValid = false;
			}
			if (!isValid) {
				MessageBox.alert(msg);
				return false;
			}

			data.fromDate += 'T00:00:00.000Z';
			data.toDate += 'T23:59:59.000Z';
			return data;
		},
		onSubmitPress: async function() {
			var _self = this;
			try {
				//var token= await _self.getToken();
				//console.log(token);
				var data = _self.getFormData();
				if (data === false) {
					return;
				}
				//console.log(data);
				var backtraking = await _self.getBacktraking(_self.token, data);
				console.log(backtraking);
				var start = backtraking[0];
				//backtraking.splice(0, 1)
				var end = backtraking[backtraking.length - 1];
				//backtraking.splice(backtraking.length - 1, 1)
				//var end = backtraking[52];

				console.log('start: ', start);
				console.log('end: ', end);
				console.log(backtraking)

				/*_self.addMarker({
					location: start
				})

				_self.addMarker({
					location: end
				})*/

				//console.log(_self.getWaypoints(backtraking));
				/*var wpnts =[];
				var i=0;
				backtraking.filter((item,pos)=>pos%100==0).forEach((p,i)=>{
					wpnts.push({
						location:backtraking[i],
						stopover:false
					});
				});
				
				var request = {
					origin: start,
					destination: end,
					waypoints: wpnts,
					optimizeWaypoints: true,
					travelMode: google.maps.DirectionsTravelMode.DRIVING
				};

				_self.directionService.route(request, function(response, status) {
					if (status == google.maps.DirectionsStatus.OK) {
						//print the route
						_self.directionsDispaly.setDirections(response);
					} else {
						console.log('something went wrong', status);
					}

				});*/
				
				_self.initMap(backtraking);

			} catch (error) {
				console.log(error);
				MessageBox.alert(error);
			}
		},
		initMap: function(backtraking) {
			var _self = this;
			_self.directionService = new google.maps.DirectionsService();
			_self.directionsDispaly = new google.maps.DirectionsRenderer();
			var cpoint = {
					lat: 4.814781666666667,
					lng: 7.050083333333333
				}
			if(backtraking){
				cpoint=backtraking[parseInt(backtraking.length/2)];
				console.log(cpoint);
			}
				//var start = new google.maps.LatLng(22.739863132828788, 88.3241438143934);
				//var end = new google.maps.LatLng(22.706316193093127, 88.34563177228142);
			var options = {
				center: cpoint,
				zoom: 11
			};
			console.log(cpoint);

			//Init map
			/*map = new google.maps.Map(document.getElementById("map"), options);
			_self.map = map;
			_self.directionsDispaly.setMap(map)*/

			/*var request = {
				origin: start,
				destination: end,
				//waypoints: _self.getWaypoints(backtraking),
				//optimizeWaypoints: true,
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			};

			_self.directionService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					//print the route
					_self.directionsDispaly.setDirections(response);
				} else {
					console.log('something went wrong', status);
				}

			});*/

			map = new google.maps.Map(document.getElementById("map"), options);

			if (backtraking) {
				const flightPath = new google.maps.Polyline({
					path: backtraking,
					geodesic: true,
					strokeColor: "#FF0000",
					strokeOpacity: 1.0,
					strokeWeight: 2,
				});

				flightPath.setMap(map);
			}
		},
		getWaypoints: function(locations) {
			var locations = locations
				.filter((item, pos) => pos % 100 == 0)
				.map(l => {
					return {
						location: l,
						stopover: false
					}
				});
			console.log(locations);
			return locations;
		},
		addMarker: function(props) {
			var marker = new google.maps.Marker({
				position: props.location,
				map: this.map
			})
			if (props.icon) {
				marker.setIcon(props.icon)
			}
		}
	});
});