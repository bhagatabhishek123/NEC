"use strict";

(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }

        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }

      return n[i].exports;
    }

    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
      o(t[i]);
    }

    return o;
  }

  return r;
})()({
  1: [function (require, module, exports) {
    require("./map");
  }, {
    "./map": 2
  }],
  2: [function (require, module, exports) {
    var polyline = require("google-polyline");

    var waypoints = [];
    var map;
    var service;
    var marker;
    var markers = [];
    var mv = true;
    var origin = null;
    var destination = null;
    var cv = true;

    function initMap() {
      var directionsService = new window.google.maps.DirectionsService();
      var directionsRenderer = new window.google.maps.DirectionsRenderer();
      var mapOptions = {
        zoom: 7,
        center: {
          lat: 19.07596,
          lng: 72.87764
        }
      };
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var request = {
        origin: "Nagpur",
        destination: "Amaravti",
        travelMode: "DRIVING"
      };
      directionsService.route(request, function (result, status) {
        if (status == "OK") {
          directionsRenderer.setDirections(result);
          waypoints = polyline.decode(result.routes[0].overview_polyline); //console.log(waypoints);
          // for (let i = 0; i < waypoints.length; i++) {
          //   new google.maps.Marker({
          //     position: { lat: waypoints[i][0], lng: waypoints[i][1] },
          //     map: map,
          //   });
          // }
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
                // console.log(results[i]);
                if (google.maps.geometry.poly.containsLocation(results[i].geometry.location, PolygonBound) == true) {
                  if (results[i].name.includes("Toll Plaza")) {
                    (function () {
                      var cald = function cald(markers) {
                        if (cv) {
                          origin = {
                            lat: markers[0].lat(),
                            lng: markers[0].lng()
                          }; // console.log('origin', origin)
                        } else {
                          destination = {
                            lat: markers[1].lat(),
                            lng: markers[1].lng()
                          }; // console.log('desti', destination)
                        }

                        cv = !cv; // console.log(cv);

                        if (origin != null && destination != null) {
                          var directionsService = new google.maps.DirectionsService();
                          var request = {
                            origin: origin,
                            destination: destination,
                            travelMode: 'DRIVING'
                          };
                          directionsService.route(request, function (result, status) {
                            console.log(result);
                            var di = result.routes[0].legs[0].distance.text;
                            console.log(di);

                            if (status == 'OK') {
                              // alert("distance between this two plaza : " + di);
                              alert("distance between this two plaza : " + di);

                              for (var k = 0; k < markers.length; k++) {
                                console.log("in for loop");
                                console.log(markers[k]);
                                markers[k].setIcon(pinSymbol('Red'));
                              }
                            }
                          }); // markers.length = 0;
                          // restoreColors();
                          // this.setIcon(pinSymbol('Red'));
                        } // restoreColors();

                      }; // markers.push(marker);


                      console.log(results[i]);
                      marker = new google.maps.Marker({
                        position: results[i].geometry.location,
                        map: map,
                        icon: pinSymbol('Red'),
                        title: results[i].name,
                        originalColor: 'Red'
                      }); // marker.addListener('click', changeColor);

                      google.maps.event.addListener(marker, "click", function (event) {
                        // alert(this.position);
                        markers.push(this.position);
                        this.setIcon(pinSymbol('blue'));
                        cald(markers); // console.log(markers);
                      });
                    })();
                  }
                }
              }
            }
          };

          service.nearbySearch({
            location: {
              lat: waypoints[j][0],
              lng: waypoints[j][1]
            },
            radius: "20000",
            keyword: "Toll Plaza"
          }, callback);
        }
      }); // function restoreColors() {
      //   for (var i = 0; i < markers.length; i++) {
      //     markers[i].setIcon(pinSymbol(markers[i].originalColor));
      //   }
      // }
      // function changeColor(evt) {
      //   this.setIcon(pinSymbol('blue'));
      //   markers.push(marker);
      //   console.log("marker array ",markers);
      //   if(markers.length==1){
      //   const origin = {lat:markers[0].position.lat(), lng:markers[0].position.lng()};
      //   console.log('origin',origin)
      //   }
      //   else{
      //     const destination = {lat:markers[1].position.lat(), lng:markers[1].position.lng()};
      //     console.log('desti',destination)
      //   }
      //   console.log(markers.length);
      // }

      function pinSymbol(color) {
        return {
          path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#000',
          strokeWeight: 2,
          scale: 1
        };
      }

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
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAda4zTN_Eg3hHoML7MYL3N1SQ7BdYsfy0&callback=initMap&libraries=places";
    script.defer = true;

    window.initMap = function () {
      initMap();
    };

    document.head.appendChild(script);
  }, {
    "google-polyline": 5
  }],
  3: [function (require, module, exports) {
    var PRECISION = 1e5;

    function decode(value) {
      var points = [];
      var lat = 0;
      var lon = 0;
      var values = decode.integers(value, function (x, y) {
        lat += x;
        lon += y;
        points.push([lat / PRECISION, lon / PRECISION]);
      });
      return points;
    }

    decode.sign = function (value) {
      return value & 1 ? ~(value >>> 1) : value >>> 1;
    };

    decode.integers = function (value, callback) {
      var values = 0;
      var x = 0;
      var y = 0;
      var _byte = 0;
      var current = 0;
      var bits = 0;

      for (var i = 0; i < value.length; i++) {
        _byte = value.charCodeAt(i) - 63;
        current = current | (_byte & 0x1f) << bits;
        bits = bits + 5;

        if (_byte < 0x20) {
          if (++values & 1) {
            x = decode.sign(current);
          } else {
            y = decode.sign(current);
            callback(x, y);
          }

          current = 0;
          bits = 0;
        }
      }

      return values;
    };

    module.exports = decode;
  }, {}],
  4: [function (require, module, exports) {
    var PRECISION = 1e5;
    var CHARCODE_OFFSET = 63;
    var CHARMAP = {};

    for (var i = 0x20; i < 0x7f; i++) {
      CHARMAP[i] = String.fromCharCode(i);
    }

    function encode(points) {
      // px, py, x and y store rounded exponentiated versions of the values
      // they represent to compute the actual desired differences. This helps
      // with finer than 5 decimals floating point numbers.
      var px = 0,
          py = 0;
      return reduce(points, function (str, lat, lon) {
        var x = Math.round(lat * 1e5);
        var y = Math.round(lon * 1e5);
        str += chars(sign(x - px)) + chars(sign(y - py));
        px = x;
        py = y;
        return str;
      });
    }

    function reduce(points, callback) {
      var point = null;
      var lat = 0;
      var lon = 0;
      var str = "";

      for (var i = 0; i < points.length; i++) {
        point = points[i];
        lat = point.lat || point.x || point[0];
        lon = point.lng || point.y || point[1];
        str = callback(str, lat, lon);
      }

      return str;
    }

    function sign(value) {
      return value < 0 ? ~(value << 1) : value << 1;
    }

    function charCode(value) {
      return (value & 0x1f | 0x20) + 63;
    }

    function chars(value) {
      var str = "";

      while (value >= 0x20) {
        str += CHARMAP[charCode(value)];
        value = value >> 5;
      }

      str += CHARMAP[value + 63];
      return str;
    }

    module.exports = encode;
  }, {}],
  5: [function (require, module, exports) {
    module.exports = {
      encode: require("./encode"),
      decode: require("./decode")
    };
  }, {
    "./decode": 3,
    "./encode": 4
  }]
}, {}, [1]);