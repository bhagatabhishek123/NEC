"use strict";

var polyline = require("google-polyline");

var waypoints = [];
var map;
var service;
var tarry = [];
var marker;

function initMap() {
  var directionsService = new window.google.maps.DirectionsService();
  var directionsRenderer = new window.google.maps.DirectionsRenderer(); // autocomplete.bindTo("bounds", map);

  var mapOptions = {
    zoom: 7,
    center: {
      lat: 19.07596,
      lng: 72.87764
    }
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  var request = {
    origin: "mumbai",
    destination: "pune",
    travelMode: "DRIVING"
  };
  directionsService.route(request, function (result, status) {
    console.log("direction result", result);

    if (status == "OK") {
      directionsRenderer.setDirections(result);
      waypoints = polyline.decode(result.routes[0].overview_polyline);
    }

    var PolygonCoords = PolygonPoints();
    var PolygonBound = new google.maps.Polygon({
      paths: PolygonCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35
    });
    PolygonBound.setMap(map);
    service = new google.maps.places.PlacesService(map);

    for (var j = 0; j < waypoints.length; j += 40) {
      var callback = function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            if (google.maps.geometry.poly.containsLocation(results[i].geometry.location, PolygonBound) == true) {
              marker = new google.maps.Marker({
                position: results[i].geometry.location,
                map: map,
                title: "Hello World!"
              });
              tarry.push(marker);
            }
          } // console.log("toll plaza arry",tarry);

        }
      };

      service.nearbySearch({
        location: {
          lat: waypoints[j][0],
          lng: waypoints[j][1]
        },
        radius: '20000',
        type: ['restaurant']
      }, callback);
    }
  });
  directionsRenderer.setMap(map);
}

function PolygonPoints() {
  var polypoints = waypoints;
  var PolyLength = polypoints.length;
  var UpperBound = [];
  var LowerBound = [];

  for (var j = 0; j <= PolyLength - 1; j++) {
    var NewPoints = PolygonArray(polypoints[j][0]);
    UpperBound.push({
      lat: NewPoints[0],
      lng: polypoints[j][1]
    });
    LowerBound.push({
      lat: NewPoints[1],
      lng: polypoints[j][1]
    });
  }

  var reversebound = LowerBound.reverse();
  var FullPoly = UpperBound.concat(reversebound);
  return FullPoly;
}

function PolygonArray(latitude) {
  var R = 6378137;
  var pi = 3.14; //distance in meters

  var upper_offset = 300;
  var lower_offset = -300;
  Lat_up = upper_offset / R;
  Lat_down = lower_offset / R; //OffsetPosition, decimal degrees

  lat_upper = latitude + Lat_up * 180 / pi;
  lat_lower = latitude + Lat_down * 180 / pi;
  return [lat_upper, lat_lower];
}

var script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key=&callback=initMap&libraries=places&geometry";
script.defer = true;

window.initMap = function () {
  initMap();
};

document.head.appendChild(script);