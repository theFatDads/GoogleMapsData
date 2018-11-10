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

function openMaps(url){
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

function initgeoJSONMap(mapID, center, geoJSONLink,info) {
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
  var map = new google.maps.Map(document.getElementById(mapID), {
    center: center,
    zoom: 9,
  });
  var infoWindow = new google.maps.InfoWindow({
    maxWidth: 300,
  })
  for (let i = 0; i < geoLocatedData.length; i++) {
    let marker = new google.maps.Marker({
      position: {
        lat: geoLocatedData[i].geometry.bounds.l.j,
        lng: geoLocatedData[i].geometry.bounds.j.j
      },
      map: map,
      title: geoLocatedData.name, //TODO: ADD THIS PROPERTY WHEN GEOCODING.
      data: geoLocatedData[i], //hopefully this just sets the data as a property of the marker.
    })
  }
  map.data.addListener('click', function (event) {
    let mark = event.feature;
    let name = mark.data.name //TODO: ADD THIS PROPERTY WHEN GEOCODING.
    let address = mark.data.address_components[0] + " " + mark.data.address_components[1].short_name;
    let city = mark.data.address_components[2].long_name;
    let state = mark.data.address_components[4].short_name;
    let url = addresstoUrl(address, city, state);
    let fullBox = formatInfoBox(name, address, city, state, url);
    infoWindow.setContent(fullBox);
    infoWindow.setPosition(mark.getGeometry().get());
    infoWindow.setOptions({
      pixelOffset: new google.maps.Size(0,-40)
    });
    infoWindow.open(map)
  })
}

//OLD code for getting latitude and longitude, will use later to import geocoded JSON.
// let jsonlist;
// let request = new XMLHttpRequest();
// request.open('GET', 'https://data.ct.gov/resource/htz8-fxbk.json');
// request.responseType = 'json';
// request.send();
//Once recieved, pull out our information, and iterate each into a marker.
// request.onload = function () {
//   jsonlist = request.response;
//   console.log("Recieved JSON File")
//   for (x of jsonlist) {
//     address = `${x.address} + ${x.city} + ${x.town}`
//     locations.push(locate(geocoder, address))
//   }

//   console.log(locations)
//   for (let i = 0; i < locations.length; i++) {
//     let marker = new google.maps.Marker({
//       position: locations[i].latlng,
//       map: map,
//       title: locations[i].name,
//     });
//     let url =
//       `https://www.google.com/maps/place/${locations[i].address.split(" ").join("+")},+${locations[i].city},+${locations[i].state}`
//     let fullBox =
//       `<div><h4>${locations[i].name}</h4><div>${locations[i].address} ${locations[i].city}, ${locations[i].state} <p><a href=${url}>Get Diretions</a></p></div>`
//     let infoWindow = new google.maps.InfoWindow({
//       content: fullBox,
//       maxWidth: 200,
//     });
//     marker.addListener('click', function () {
//       infoWindow.open(map, marker);
//     });
//   }
// }
// }

function main() {
  var geocoder = new google.maps.Geocoder(); //Creating the needed URL.
  var MyHouse = locate(geocoder, "95 Kellers Farm Rd")
  console.log(MyHouse);
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
  var drugBox = "https://data.ct.gov/api/geospatial/uem2-db2e?method=export&format=GeoJSON";
  var careFacilities = "https://data.ct.gov/resource/htz8-fxbk.json";
  initgeoJSONMap(mainMap, CT, drugBox,["location-name","address","city","state"]);
  initgeoJSONMap("map2",VT,randomDat, ["LIBRARY","PRIMARYADD","TOWNNAME","COUNTY"])
}
main()