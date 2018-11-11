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

function addressToURL(address,city,state){
  'Given an address, City, and state string, generates an address based on the users device'
  if ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || (navigator.platform.indexOf("iPad") != -1)) {
    return `https://maps.apple.com/?daddr=${address.split(" ").join("+")},+${city},+${state}`
  } else {
    return `https://maps.apple.com/?daddr=${address.split(" ").join("+")},+${city},+${state}`
  }
}

function formatInfoBox(name, address, city, state, url) {
  return `<b>${name}</b><p>${address} ${city}, ${state} \n</br><a href="${url}">Get Directions</a></p>`
}

function initgeoJSONMap(mapID, center, geoJSONLink, info) {
  'Initializes a google map, given a mapID, center for the map, and the link to a geoJSON file.'
  'Info should be a list with the property directory: [name, address, city, state]'
  var map = new google.maps.Map(document.getElementById(mapID), {
    center: center,
    zoom: 7,
    mapTypeControl: false,
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
    let url = addressToURL(markInfo.address, markInfo.city, markInfo.state)
    let fullBox = formatInfoBox(markInfo.name, markInfo.address, markInfo.city, markInfo.state, url)
    infoWindow.setContent(fullBox);
    infoWindow.setPosition(event.feature.getGeometry().get());
    infoWindow.setOptions({
      pixelOffset: new google.maps.Size(0, -40)
    });
    infoWindow.open(map);
  })
}

function initGeocodeMap(mapID, center, geoLocatedData) {
  'Creates a new map with plotted points given a map DIV id, a center for the map, and data that has been geocoded using the Google API.'
  let geocoded;
  var map = new google.maps.Map(document.getElementById(mapID), {
    center: center,
    zoom: 7,
    mapTypeControl: false
  });
  var infoWindow = new google.maps.InfoWindow({
    maxWidth: 300,
  })
  let request = new XMLHttpRequest();
  request.responseType = 'json';
  request.open('GET', geoLocatedData,true);
  request.send();
  request.onload = function () {
    geocoded = request.response;
    for (let i = 0; i < geocoded.length; i++) {
      let marker = new google.maps.Marker({
        position: geocoded[i].geometry.location,
        map: map,
        title: geocoded[i].name, //TODO: ADD THIS PROPERTY WHEN GEOCODING.
        data: geocoded[i], //hopefully this just sets all data as a property of the marker.
      })
      marker.addListener('click',function(){
      let name = this.data.name //TODO: ADD THIS PROPERTY WHEN GEOCODING.
      let address = this.data.address_components[0].short_name + " " + this.data.address_components[1].short_name;
      let city = this.data.address_components[2].long_name;
      let state = this.data.address_components[4].short_name;
      let url = addressToURL(address, city, state);
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
  initGeocodeMap(mainMap, CT, geocoded)
  initgeoJSONMap("map2", CT, drugBox, ["location_name", "location_1_address", "city", "state"]);
}
main()