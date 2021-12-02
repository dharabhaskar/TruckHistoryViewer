window.addEventListener('load', function() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src =
		'https://maps.googleapis.com/maps/api/js?key=AIzaSyDNFTiOxDtjntYTjvlD89SdP8CHVptOp3A&avoid=TOLLS&libraries=places&callback=initMap';
		document.body.appendChild(script);
});
	
	var map;
    function initMap() {
    var directionService = new google.maps.DirectionsService;
    var directionsDispaly = new google.maps.DirectionsRenderer;
    var rishra={lat:22.7246,lng:88.3436};
    var options = { center: rishra, zoom: 15 };

    //Init map
    map = new google.maps.Map(document.getElementById("map"), options );
    directionsDispaly.setMap(map)

    
    //Marker
    var nanto={lat: 22.724749331297783,lng: 88.31394566906668}
    var start = new google.maps.LatLng(22.739863132828788, 88.3241438143934);
    var end = new google.maps.LatLng(22.706316193093127, 88.34563177228142);

    function addMarker(props){
        var marker=new google.maps.Marker({
            position:props.location,
            map:map
        })
        if(props.icon){
            marker.setIcon(props.icon)
        }
    }

    //addMarker({location:nanto,icon:'https://img.icons8.com/fluency/48/000000/home.png'})
    
    function calcRoute(){
        var waypoints=[];
        
        waypoints.push({
            location: new google.maps.LatLng(22.702364378247957, 88.33145855187493),
            stopover:true
        });
        
        waypoints.push({
            location: nanto,
            stopover:true
        });

        waypoints.push({
            location: rishra,
            stopover:true
        });
        

        return waypoints;
    }

    var request = {
        origin: nanto, 
        destination: end,
        //waypoints: calcRoute(),
        //	optimizeWaypoints: false,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    
    directionService.route(request, function(response, status) {
        if(status == google.maps.DirectionsStatus.OK)
        {
            //print the route
            directionsDispaly.setDirections(response);
        }
        else
        {
          console.log('something went wrong',status);
        }
    
    });
}