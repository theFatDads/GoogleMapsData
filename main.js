String.prototype.caps = function () {
  `Capitalizes the first letter of each word, used for geoJSON files with all-caps addresses.`
  caps = []
  splitString = this.split(" ")
  for (let i = 0; i < splitString.length; i++) {
    word = splitString[i]
    caps.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  }
  caps = caps.join(" ")
  return caps
}

function addresstoUrl(address, city, state) {
  'given an address, city and state string, return a Maps url to this address.'
  return `https://www.google.com/maps/dir/?api=1&destination=${address.split(" ").join("+")},+${city},+${state}`
  //return `https://www.google.com/maps/place/${address.split(" ").join("+")},+${city},+${state}`
}

function openMaps(url) {
  'opens map in native maps app if on mobile, otherwise opens map url in google maps.'
  if ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || (navigator.platform.indexOf("iPad") != -1)) {
    window.open("maps://" + url.slice(12))
  } else {
    window.open(url);

  }
}

function formatInfoBox(name, address, city, state, url) {
  return `<div><h4>${name}</h4><div>${address} ${city}, ${state} <p><a onclick="openMaps('${url}')" href="#">Get Directions</a></p></div>`
}

function locate(geocoder, address) {
  'Given an address string and a Google geocoder, returns an array with location information.'
  geocoder.geocode({
    'address': address,
  }, function (results, status, geoResults) {
    if (status == 'OK') {
      var location = results[0].geometry.location;
      console.log(results[0]);
    } else {
      return "ERROR";
      console.log("Geolocation Error: " + status);
    }
  })
}

function initgeoJSONMap(mapID, center, geoJSONLink, info) {
  'Initializes a google map, given a mapID, center for the map, and the link to a geoJSON file.'
  'Info should be a list with the property directory: [name, address, city, state]'
  var map = new google.maps.Map(document.getElementById(mapID), {
    center: center,
    zoom: 9,
  });
  map.data.loadGeoJson(geoJSONLink);
  var infoWindow = new google.maps.InfoWindow({
    maxWidth: 300,
  })
  map.data.addListener('click', function (event) {
    var mark = event.feature;
    let markInfo = {
      name: mark.getProperty(info[0]).caps(),
      address: mark.getProperty(info[1]).caps(),
      city: mark.getProperty(info[2]).caps(),
      state: mark.getProperty(info[3]),
    }
    let url = addresstoUrl(markInfo.address, markInfo.city, markInfo.state)
    let fullBox = formatInfoBox(markInfo.name, markInfo.address, markInfo.city, markInfo.state, url)
    infoWindow.setContent(fullBox);
    infoWindow.setPosition(event.feature.getGeometry().get());
    infoWindow.setOptions({
      pixelOffset: new google.maps.Size(0, -40)
    });
    infoWindow.open(map);
  })
}

function initMap(mapID, center, geoLocatedData) {
  'Creates a new map with plotted points given a map DIV id, a center for the map, and data that has been geocoded using the Google API.'
  let geocoded;
  var map = new google.maps.Map(document.getElementById(mapID), {
    center: center,
    zoom: 9,
  });
  var infoWindow = new google.maps.InfoWindow({
    maxWidth: 300,
  })
  map.data.addListener('click', function () {
    console.log("AH");
  })
  let request = new XMLHttpRequest();
  request.responseType = 'json';
  request.open('GET', geoLocatedData,true);
  request.send();
  request.onload = function () {
    geocoded = request.response;
    console.log("Recieved JSON File")
    console.log(geocoded[0]);
    for (let i = 0; i < geocoded.length; i++) {
      let marker = new google.maps.Marker({
        position: geocoded[i].geometry.location,
        map: map,
        title: geocoded[i].name, //TODO: ADD THIS PROPERTY WHEN GEOCODING.
        data: geocoded[i], //hopefully this just sets all data as a property of the marker.
      })
      marker.addListener('click',function(){
        console.log(this)
      let name = this.data.name //TODO: ADD THIS PROPERTY WHEN GEOCODING.
      let address = this.data.address_components[0].short_name + " " + this.data.address_components[1].short_name;
      let city = this.data.address_components[2].long_name;
      let state = this.data.address_components[4].short_name;
      let url = addresstoUrl(address, city, state);
      let fullBox = formatInfoBox(name, address, city, state, url);
      infoWindow.setContent(fullBox);
      infoWindow.setPosition(this.data.geometry.location)
      infoWindow.setOptions({
        pixelOffset: new google.maps.Size(0, -40)
      });
      infoWindow.open(map)
      })
    }
  }
}

function main() {
  var geocoder = new google.maps.Geocoder(); //Creating the needed URL.
  var CT = { //Connecticut centered location
    lat: 41.5,
    lng: -72.63,
  };
  var VT = {
    lat: 44,
    lng: -72.7
  }
  var mainMap = "boxMap";
  var randomDat = "http://geodata.vermont.gov/datasets/3a87ceb1e3b944b89598abe6c4169f85_0.geojson"
  var geocoded = "https://raw.githubusercontent.com/theFatDads/GoogleMapsData/master/geo-locations.json"
  var drugBox = "https://data.ct.gov/api/geospatial/uem2-db2e?method=export&format=GeoJSON";
  var careFacilities = "https://data.ct.gov/resource/htz8-fxbk.json";
  initMap(mainMap, CT, geocoded)
  initgeoJSONMap("map2", CT, drugBox, ["location_name", "location_1_address", "city", "state"]);
}
main()