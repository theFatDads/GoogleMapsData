# Data2GoogleMap
## About
While working on our "Connecticut Tech Challenge" submission, my team wanted to implement data from data.ct.gov in Google Maps. We found that the data either was in geoJSON format and a general JSON file with data.

If the files weren't GeoJSON, they typically lacked the latitude and longitude values we needed to plot the points on a Google Map. We made a server which periodically processes data and outputs it as a list containing geolocated (locating latitude and longitude cooridnates from an address) data.

We had two types of data to process: GeoJSON files and data which was processed by geolocation.

Therefore, we made this library which simplifies the entire process. Data2GoogleMap Does the dirty work of making a Google Map with plotted points, and outputs each marker with clickable point, with a link that redirects to Google Maps, or the user's default Map application on their phone.

![Example](https://raw.githubusercontent.com/theFatDads/GoogleMapsData/master/Images/Example.png)

## Installation
To use these functions in your code, you must:
* Add the Google Maps Embed API with your Google Cloud API Key in HTML file.
* Add this Javascript File to your HTML

Your HTML file will look something like this:

```
<html>
  <head>
  </head>
    <body>
      <div class="map" id="mapID"></div>
    </body>
  <script src="https://maps.googleapis.com/maps/api/js?key=[API KEY]"></script>
  <script src="Data2Map.js"></script>
  <script src="[YourJsFile.js]"></script>
</html>
```

## Usage
The two main functions in this library are `initgeoJSONMap` and `initgeocodeMap`

### initGeocodeMap(mapID,center,data)
This function Requires 3 parameters:
* The ID of the div you would like to use as your Google Map
* The latitude and longitude at which you would like your map to be centered (Written as an object with properties `lat` and `lng`)
* The link of a JSON file in the format of Google's Geolocation API output (and containing a "name" property.).

#### Example:
```  
var mainMap = "mapID";
var CT = { //Connecticut centered location
  lat: 41.5,
  lng: -72.63,
};
var geocodedData = "geocodedLocations.json"
initGeocodeMap(mainMap, CT, geocodedData)
```

### initgeoJSONMap(mapID,center,data,[title,address,city,state])
This function requires 4 parameters:
* The ID of the div you would like to use as your Google Map
* The latitude and longitude at which you would like your map to be centered (Written as an object with properties `lat` and `lng`)
* The link of a geoJSON file
* An array with the names of the respective properties related to each equation.

#### Example: 
```  
var mainMap = "mapID";
var VT = { //Vermont centered location
  lat: 41.5,
  lng: -72.63,
};
var geoJSONVermontLibraries = "http://geodata.vermont.gov/datasets/3a87ceb1e3b944b89598abe6c4169f85_0.geojson"
initGeocodeMap(mainMap, CT, geoJSONData,["LIBRARY","STREETAD","CITY","])
```