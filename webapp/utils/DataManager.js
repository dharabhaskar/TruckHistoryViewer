jQuery.sap.declare("com.infocusTruckHistoryViewer.utils.DataManager");
com.infocusTruckHistoryViewer.utils.DataManager = (function() {
	var base = "https://test-serv.movam.ng/api/v1";
	var trackingBase = "https://trackapidev.movam.ng/api/devices";
	return {
		getToken: function() {
			var tokenUrl = base + "/get-token";
			var data = {
				"email": "sumit@infocus-in.com",
				"password": "12345678",
				"role": "transporter"
			};
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
		getBacktraking: function(token, formData) {
			var _self = this;
			var url = trackingBase + "/backtracking";
			return new Promise(function(resolve, reject) {
				$.ajax({
					url: url,
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json",
						"Authorization": "Bearer " + token
					},
					data: JSON.stringify(formData),
					success: function(response) {
						console.log(response);
						if (response.status == 200) {
							console.log(response);
							var data = _self.processData(response, formData);
							resolve(data);
						} else {
							reject(response.message);
							return
						}
					},
					error: function(jqXHR, exception) {
						console.log(jqXHR);
						if (jqXHR.status === 0) {
							reject("Backtracking call failed.")
						} else if (jqXHR.status >= 500 && jqXHR.status <= 599) {
							reject(`Internal server error [${jqXHR.status}].`)
						}
					}
				});
			});
		},
		processData: function(response, formData) {
			var _self=this;
			var i=0;
			if (!formData) {
				formData = {
					"fromDate": "2022-01-01T00:00:00.000Z",
					"toDate": "2022-01-02T23:59:59.000Z",
					"vehicleId": [
						"12",
						"14"
					],
					"vehicleNo": [
						"FST 37 YC",
						"FST 38 NC"
					]
				};
			}
			console.log(response);
			return response.result.map(item => item.data).map(result => {
				//console.log(item);
				var locations = result.filter(function(item, pos) {
					return result.map(l => l.latitude).indexOf(item.latitude) == pos
				}).map(l => {
					return {
						location: {
							lat: l.latitude,
							lng: l.longitude
						},
						info: {
							name: formData.vehicleNo[i],
							time: _self.formatDate(new Date(l.deviceTime)),
							address: l.address,
							speed: l.speed,
							ignition: l.attributes.ignition ? "Yes" : "No"
						}
					}
				});
				i += 1;
				return locations;
				//return item;
			});
		},
		getAllVehicles: function(token) {
			var vehiclesApiUrl = base + "/vehicles";
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
		formatDate: function(d) {
			return `${d.getDate()}-${d.getMonth()}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
		}
	};
}());