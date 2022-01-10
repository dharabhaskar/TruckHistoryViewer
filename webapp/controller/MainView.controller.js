/* global dataTable:true */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"com/infocusTruckHistoryViewer/utils/DataManager",
	"com/infocusTruckHistoryViewer/libs/dataTable.min",
], function(Controller, MessageBox, BusyIndicator, DataManager, dataTable) {
	"use strict";
	var map;
	return Controller.extend("com.infocusTruckHistoryViewer.controller.MainView", {
		onInit: async function() {
			var _self = this;
			_self.data = {};
			_self.getView().setModel(new sap.ui.model.json.JSONModel(_self.data), "dataSet");

			var model = _self.getView().getModel("dataSet");

			var key1 = 'AIzaSyAsjidHqlFl7k0kmvv4sGmU5ngUFA-3m5k';

			//Add google api
			jQuery.sap.addUrlWhitelist("https", "maps.googleapis.com");
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = `https://maps.googleapis.com/maps/api/js?key=${key1}&avoid=TOLLS`;

			//Add click event
			$(document).on("click", "#btnSubmit", function(event) {
				_self.onSubmitPress();
				
/*			var hide=document.getElementById('hide');
			
			hide.addEventListener('click',()=>{
				form.style.display="none";
				
			});*/
			
			});
			$(document).on("click", "#btnShowData", function(event) {
				_self.showDataClicked();
			});

			var allSel = [];

			$('#truckNo').change(function(e) {
				var ele = document.getElementById('truckNo');
				var ind = Array.from(ele.selectedOptions).map(item => item.index);
				console.log(allSel)
				var diff = ind.filter(x => !allSel.includes(x));
				console.log(diff[0])

				diff.forEach(x => allSel.push(x))

				if ($("#truckNo").val().length > 2) {
					sap.m.MessageBox.alert("You can select max 2 vehicle at a time.");
					this.options[diff[0]].selected = false;
					allSel = [];
				}

			});

			try {
				BusyIndicator.show();
				_self.token = await DataManager.getToken();
				var vehcilesResp = await DataManager.getAllVehicles(_self.token);

				vehcilesResp.data.forEach(v => {
					var optionValue = v.id;
					var optionText = v.vehicleNo;
					$('#truckNo').append(
						`<option value="${optionValue}">
	                                       ${optionText}
	                                  </option>`
					);
				});
				_self.initMap();

				BusyIndicator.hide();

			} catch (error) {
				BusyIndicator.hide();
				console.log(error);
			}

			//Initial date values...
			$('#startDate').val('2021-12-20');
			$('#endDate').val('2021-12-21');
			
			// btn,form,main,btnSubmit
			var btn=document.getElementById('btn');
			var form=document.getElementById('form');
			var hide=document.getElementById('hide');
			var main=document.getElementById('main');
			var btnSubmit=document.getElementById('btnSubmit');
			
			

			hide.addEventListener('click',()=>{
				form.style.display="none";
				main.style.clipPath="polygon(0% 0%, 89% 0, 90% 42%, 100% 70%, 90% 77%, 90% 100%, 0 100%)";
				btn.style.marginRight="7px";
			});
			btn.addEventListener('click',()=>{
				form.style.display="block";
				main.style.clipPath="none";
			});
			
			btnSubmit.addEventListener('click',()=>{
				form.style.display="none";
				main.style.clipPath="polygon(0% 0%, 89% 0, 90% 42%, 100% 70%, 90% 77%, 90% 100%, 0 100%)";
				btn.style.marginRight="7px";
			})
			

		},
/*		Vno:function(){
			var Vnos={};
			console.log(Vnos);
		},*/
		getFormData: function() {
			var data = {};
			data.fromDate = $("#startDate").val();
			data.toDate = $("#endDate").val();
			data.vehicleId = $("#truckNo").val();
			data.vehicleNo = $("#truckNo option:selected").text();
			//data.vehicleNo = $('#truckNo').find(":selected").text()

			var vNos = data.vehicleNo.split('\n\t').map(item => item.trim()).filter(item => item.length > 0);
/*			Vno.Vnos= vNos;*/
			console.log(vNos);
<<<<<<< HEAD
			data.vehicleNo = vNos;
=======
<<<<<<< HEAD
/*			console.log(Vno);*/
=======
>>>>>>> branch 'main' of https://github.com/dharabhaskar/TruckHistoryViewer.git
			/*data.vehicleNo = vNos;*/
>>>>>>> c0ce827eeeddd7e92139e59d8f7b2d20211fa907

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

			console.log(data);

			return data;
		},
		onSubmitPress: async function() {
			var _self = this;
			try {
				var data = _self.getFormData();
				if (data === false) {
					return;
				}
				BusyIndicator.show();
				var response = await DataManager.getBacktraking(_self.token, data);
				BusyIndicator.hide();

				//var backtraking = response.map(r => r.location);
				//var extras = response.map(r => r.info);
				var extras = [];
				var i = 1;
				response.forEach(item => {
						//var ex = item.map(r => r.info)
						item.forEach(r => {
							var info = r.info;
							info.slno = i;
							extras.push(r.info);
							i += 1;
						})
					})
					//console.log(extras);
				var model = _self.getView().getModel("dataSet");
				model.setProperty("/extras", extras);

<<<<<<< HEAD
				_self.initMap(response);
=======
				//$('#btnSubmit').value='Add More Truck';

				 console.log(response,data);
				 var vNos = data.vehicleNo.split('\n\t').map(item => item.trim()).filter(item => item.length > 0);
				 console.log(vNos);
				_self.initMap(response,vNos);
>>>>>>> c0ce827eeeddd7e92139e59d8f7b2d20211fa907

			} catch (error) {
				BusyIndicator.hide();
				console.log(error);
				MessageBox.alert(error);
			}
			
		},
		buildDataTable: function() {
			var table = this.byId('data-table');
			var colName = new sap.m.Column("colName", {
				header: new sap.m.Label({
					text: "Name"
				})
			});
			var colTime = new sap.m.Column("colTime", {
				header: new sap.m.Label({
					text: "Time"
				})
			});
			var colAddress = new sap.m.Column("colAddress", {
				header: new sap.m.Label({
					text: "Address"
				})
			});
			var colSpeed = new sap.m.Column("colSpeed", {
				header: new sap.m.Label({
					text: "Speed"
				})
			});

			var colIgnition = new sap.m.Column("colIgnition", {
				header: new sap.m.Label({
					text: "Ignition"
				})
			});

			table.bindItems("dataSet>/extras", new sap.m.ColumnListItem({
				cells: [new sap.m.Text({
						text: "{dataSet>name}"
					}),
					new sap.m.Text({
						text: "{dataSet>time}"
					}),
					new sap.m.Text({
						text: "{dataSet>address}"
					}),
					new sap.m.Text({
						text: "{dataSet>speed}",
					}),
					new sap.m.Text({
						text: "{dataSet>ignition}"
					}),
				]
			}));
			table.addColumn(colName);
			table.addColumn(colTime);
			table.addColumn(colAddress);
			table.addColumn(colSpeed);
			table.addColumn(colIgnition);

		},
		showDataClicked: function() {
			var that = this;
			if (!that.resizableDialog) {
				var oTable = new sap.m.Table("tab-1", {
					inset: true,
					mode: sap.m.ListMode.None,
					includeItemInSelection: false,
					growing: true,
					growingThreshold: 1000
				});
				var col1 = new sap.m.Column("col1", {
					header: new sap.m.Label({
						text: "Truck No"
					}),
					width: "8rem"
				});
				var col2 = new sap.m.Column("col2", {
					header: new sap.m.Label({
						text: "Date Time"
					}),
					width: "10rem"
				});
				var col3 = new sap.m.Column("col3", {
					header: new sap.m.Label({
						text: "Address"
					})
				});

				var col4 = new sap.m.Column("col4", {
					header: new sap.m.Label({
						text: "Speed"
					}),
					width: "4rem"
				});

				var col5 = new sap.m.Column("col5", {
					header: new sap.m.Label({
						text: "Ignition"
					}),
					width: "4rem"
				});

				oTable.bindItems("dataSet>/extras", new sap.m.ColumnListItem({
					cells: [new sap.m.Text({
						text: "{dataSet>name}"
					}), new sap.m.Text({
						text: "{dataSet>time}"
					}), new sap.m.Text({
						text: "{dataSet>address}"
					}), new sap.m.Text({
						text: "{dataSet>speed}"
					}), new sap.m.Text({
						text: "{dataSet>ignition}"
					})]
				}));

				oTable.addColumn(col1);
				oTable.addColumn(col2);
				oTable.addColumn(col3);
				oTable.addColumn(col4);
				oTable.addColumn(col5);

				that.resizableDialog = new sap.m.Dialog({
					title: 'Truck History Details',
					contentWidth: "850px",
					contentHeight: "300px",
					resizable: true,
					content: oTable,
					beginButton: new sap.m.Button({
						text: 'Close',
						press: function() {
							that.resizableDialog.close();
						}
					})
				});

				//to get access to the global model
				this.getView().addDependent(that.resizableDialog);
			}

			that.resizableDialog.open();

			//this._getDialog().open();
		},
		initMap: function(data,vNos) {
			var _self = this;
			//_self.directionService = new google.maps.DirectionsService();
			//_self.directionsDispaly = new google.maps.DirectionsRenderer();

			var options = {
				center: {
					lat: 4.814781666666667,
					lng: 7.050083333333333
				},
				zoom: 11,
				mapTypeId: 'satellite',
			};

			// map location
			map = new google.maps.Map(document.getElementById("map"), options);
			_self.i = 0;
			var latlngbounds = new google.maps.LatLngBounds();
			_self.colors = ["#FF0000", "#0000FF"];
			console.log(_self.colors[_self.i]);

			var mapDrawSuccess = false;
			if (data) {
				data.forEach(item => {

					var backtraking = item.map(r => r.location);
					console.log(backtraking);
					if (backtraking && backtraking.length >= 2) {
						mapDrawSuccess = true;
						const trackingPath = new google.maps.Polyline({
							path: backtraking /*.filter((item,pos)=>pos>150)*/ ,
							geodesic: true,
							strokeColor: _self.colors[_self.i],
							strokeOpacity: 0.7,
							strokeWeight: 5,
						});

						console.log(_self.colors[i]);
						console.log(_self.i)

						trackingPath.setMap(map);

						_self.addMarker({
							location: backtraking[0]
						});
						_self.addMarker({
							location: backtraking[backtraking.length - 1]
						});

						//var latlngbounds = new google.maps.LatLngBounds();
						for (var i = 0; i < backtraking.length; i++) {
							latlngbounds.extend(backtraking[i]);
						}
						//map.fitBounds(latlngbounds);
					}

					_self.i += 1;

				});
				if (mapDrawSuccess) {
					map.fitBounds(latlngbounds)
				} else {
					sap.m.MessageBox('Empty result.');
				}
			}
			var i = 0;
<<<<<<< HEAD
=======
			var latlngbounds = new google.maps.LatLngBounds();
			var colors = ["#0000FF","#FF0000"];
<<<<<<< HEAD
			var Vno=vNos[i];
			console.log(Vno);
			
=======
>>>>>>> branch 'main' of https://github.com/dharabhaskar/TruckHistoryViewer.git
>>>>>>> c0ce827eeeddd7e92139e59d8f7b2d20211fa907
			data.forEach(item => {

				var backtraking = item.map(r => r.location);
				console.log(backtraking);
				if (backtraking && backtraking.length >= 2) {
					const trackingPath = new google.maps.Polyline({
						path: backtraking /*.filter((item,pos)=>pos>150)*/ ,
						geodesic: true,
						strokeColor: colors[i],
						strokeOpacity: 0.7,
						strokeWeight: 5,
					});

					trackingPath.setMap(map);

					_self.addMarker1({
<<<<<<< HEAD
						location: backtraking[0],
						title:vNos[i]
=======
						location: backtraking[0]
>>>>>>> branch 'main' of https://github.com/dharabhaskar/TruckHistoryViewer.git
					});
					_self.addMarker({
						location: backtraking[backtraking.length - 1],
						title:vNos[i]
					});

					/*var latlngbounds = new google.maps.LatLngBounds();
					for (var i = 0; i < backtraking.length; i++) {
						latlngbounds.extend(backtraking[i]);
					}
					map.fitBounds(latlngbounds);*/
					latlngbounds.extend(backtraking[i]);
				}

				i += 1;

			});
			map.fitBounds(latlngbounds)
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
				map: map,
				animation:google.maps.Animation.Drop
			})
			if (props.icon) {
				marker.setIcon(props.icon)
<<<<<<< HEAD
			};
/*            var infowindow = new google.maps.InfoWindow({
               content:props.title
            });
            infowindow.open(map,marker);
            console.log(props.title);*/
            var infowindow = new google.maps.InfoWindow();
			google.maps.event.addListener(marker, 'mouseover', (function(marker) {
            return function() {
                var content = props.title;
                infowindow.setContent(content);
                infowindow.open(map, marker);
            }
          })(marker));
		},
		addMarker1: function(props) {
			var marker = new google.maps.Marker({
				position: props.location,
				map: map,
				animation:google.maps.Animation.Drop,
				icon: {
					path: google.maps.SymbolPath.CIRCLE,
					scale: 8.5,
					fillColor: "#0000FF",
					fillOpacity: 0.7,
					strokeWeight: 0.5,
				}
			});
/*			 var infowindow = new google.maps.InfoWindow({
               content:props.title
            });
            infowindow.open(map,marker);*/
             var infowindow = new google.maps.InfoWindow();
			google.maps.event.addListener(marker, 'mouseover', (function(marker) {
            return function() {
                var content = props.title;
                infowindow.setContent(content);
                infowindow.open(map, marker);
            }
          })(marker));
		},
=======
			}
		},
		addMarker1: function(props) {
			var marker = new google.maps.Marker({
				position: props.location,
				map: map,
				icon: {
					scale: 8.5,
					fillColor: "#0000FF",
					fillOpacity: 0.7,
					strokeWeight: 0.5
				},
			})
		}
>>>>>>> branch 'main' of https://github.com/dharabhaskar/TruckHistoryViewer.git

	});
});
