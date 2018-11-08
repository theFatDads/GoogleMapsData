String.prototype.caps = function () {
  `Capitalizes the first letter of each word`
  caps = []
  splitString = this.split(" ")
  for (let i = 0; i < splitString.length; i++) {
    word = splitString[i]
    caps.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  }
  caps = caps.join(" ")
  return caps
}

var geocoder = new google.maps.Geocoder();

function addresstoUrl(address,city,state){
  return `${address.split(" ").join("+")},+${city},+${state}`
}

function openMaps(url){
  if((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || (navigator.platform.indexOf("iPad") != -1)){
    window.open("maps://"+url.slice(12))
  } else {
    window.open(url);
  }
}
function geolocate(geocoder,address){
  geocoder.geocode(
    {'address':address},function(results,status){
      if(status == 'OK'){
        console.log(results)
        return results
      }
      else {
        console.log("Geolocation Error: " + status);
      }
    }
  )
}

function initgeoJSONMap(mapID, geoJSONLink) {
  var map = new google.maps.Map(document.getElementById(mapID), {
    center: {
      lat: 41.5,
      lng: -72.63,
    },
    zoom: 9,
  });
  map.data.loadGeoJson(geoJSONLink);
  var infoWindow = new google.maps.InfoWindow({
    maxWidth: 300,
  })
  map.data.addListener('click', function (event) {
    var mark = event.feature
    let markInfo = {
      name: mark.getProperty("location_name").caps(),
      address: mark.getProperty("address").caps(),
      city: mark.getProperty("city").caps(),
      state: mark.getProperty("state"),
    }
    let convertedAddress = addresstoUrl(markInfo.address,markInfo.city,markInfo.state)
    let url =
      `https://www.google.com/maps/place/${convertedAddress}`
    let fullBox =
      `<div><h4>${markInfo.name}</h4><div>${markInfo.address}, ${markInfo.city}, ${markInfo.state}<p><a onclick="openMaps('${url}')" href="#">Get Directions</a></p></div>`
    infoWindow.setContent(fullBox);
    infoWindow.setPosition(event.feature.getGeometry().get());
    infoWindow.setOptions({
      pixelOffset: new google.maps.Size(0, -40)
    });
    infoWindow.open(map);
  })
}

function initMap(mapID,geoLocatedData) {
  var map = new google.maps.Map(document.getElementById(mapID), {
    center: {
      lat: 41.5,
      lng: -72.63,
    },
    zoom: 9,
  });
  let jsonlist;
  var locations = []
  //Get the JSON file
  let request = new XMLHttpRequest();
  request.open('GET', 'https://data.ct.gov/resource/htz8-fxbk.json');
  request.responseType = 'json';
  request.send();
  //Once recieved, pull out our information, and iterate each into a marker.
  request.onload = function () {
    jsonlist = request.response;
    console.log("Recieved JSON File")
    for (x of jsonlist) {
      address = `${x.address} + ${x.city} + ${x.town}`
      locations.push(geolocate(geocoder,address))
    }
    console.log(locations)
    for (let i = 0; i < locations.length; i++) {
      let marker = new google.maps.Marker({
        position: locations[i].latlng,
        map: map,
        title: locations[i].name,
      });
      let url =
        `https://www.google.com/maps/place/${locations[i].address.split(" ").join("+")},+${locations[i].city},+${locations[i].state}`
      let fullBox =
        `<div><h4>${locations[i].name}</h4><div>${locations[i].address} ${locations[i].city}, ${locations[i].state} <p><a href=${url}>Get Diretions</a></p></div>`
      let infoWindow = new google.maps.InfoWindow({
        content: fullBox,
        maxWidth: 200,
      });
      marker.addListener('click', function () {
        infoWindow.open(map, marker);
      });
    }
  }
}


function main() {
  console.log(geolocate(geocoder,"Uconn"));
  var mainMap = "boxMap";
  var drugBox = "https://data.ct.gov/api/geospatial/uem2-db2e?method=export&format=GeoJSON";
  var careFacilities = "https://data.ct.gov/resource/htz8-fxbk.json";
  initgeoJSONMap(mainMap, drugBox);
}
main()