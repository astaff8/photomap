/** Create a Leaflet map that reads data from Google Sheets. Each row in the
    sheet will appear as a marker on the map. When the marker is clicked, a
    popup will appear showing information about the location, taken from the
    columns of the spreadsheet.  
    
    This script assumes the Google Sheet has the following columns. These match
    the attribute names used for the Story Map Tour template in ArcGIS Online.
    
    name        A short name for the location, to appear as the popup title.
    description A sentence or two describing the location in more detail.
    lat         Latitude in decimal degrees
    long        Longitude in decimal degrees
    pic_url     The URL to an image that will be displayed in the popup.
 */
function createPhotoMap () {
  // URL of a Google Sheets spreadsheet output as CSV
  var csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS9ZuoLzXsO-fEC_dU8nRASZdjFMAbxGwDE--rI-FQwZvsG-IvvheyNBdUMxx6wXgQWDaVoX6c4GnpF/pubhtml?gid=0&single=true';
  
  // create map object with center lat/lon and zoom level
  var map = L.map('map').setView([43.58, -110.82], 3);
  
  // create basemap object. See examples at https://leaflet-extras.github.io/leaflet-providers/preview/
  var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(map);
  
  // use Papa Parse (papaparse.com) to get the Google Sheets CSV
  Papa.parse(csvUrl, {
    download: true,
    header: true, 
    dynamicTyping: true,
    complete: function(csv) {
      // declare variables
      var place, marker, markersLayer;
      
      // create a layer where marker (point) features will be saved from the CSV
      markersLayer = L.featureGroup().addTo(map);

      // go through each row of the CSV to save the values to a marker
      for (row in csv.data) {
        place = csv.data[row];
        marker = L.marker([place.lat, place.long])
          .bindTooltip(place.name, {permanent: true}) // show labels by default
          .addTo(markersLayer);
        marker.properties = {
          name: place.name,
          description: place.description,
          pic_url: place.pic_url
        };
        
      } // end of for (row in csv.data) {...
      
      // create a function to show CSV values in a popup when a marker is clicked
      markersLayer.on("click", function(event) {
        var place = event.layer.properties;
        $('.modal').modal('show');
        $('.modal-title').html(place.name)
        $('.modal-body').html(place.description + '<br><img src="' + place.pic_url + '">')
      });
      
    } // end of complete: function(csv) {...
      
  }); // end of Papa.parse(csvUrl, {...
  
  // close the popup when x or close button is clicked
  $('.closeButton').on('click', function(e){
    $('.modal').modal('hide');
  })
  
} // end of function createPhotoMap () {...

// create the map after the rest of the page has loaded
window.addEventListener('load', createPhotoMap);
