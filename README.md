# Data2GoogleMap
## About
While working on our "Connecticut Tech Challenge" submission, my team wanted to implement data from data.ct.gov in Google Maps. We found that the data either was in geoJSON format and a general JSON file with data.

If the files weren't GeoJSON, they typically lacked the latitude and longitude values we needed to plot the points on a Google Map. However, if use Google's Geolocation API 

Therefore, we made this library which simplifies the process. Data2GoogleMap Does the dirty work of making a Google Map with plotted points, and outputs each marker with clickable poi

## Installation
To use these functions in your code, you must:
* Add the Google Maps Embed API with your Google Cloud API Key in HTML file.
* Add this Javascript File to your HTML

Your HTML file will look somehting like this:

```
<html>
  <head>
  </head>
    <body>
      <div class="map" id="mapID"></div>
    </body>
  <script src="https://maps.googleapis.com/maps/api/js?key=[API KEY]"></script>
  <script src="Data2Map"></script>
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