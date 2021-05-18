// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// Create the map with our layers
var map = L.map("map-id", {
  center: [40.73, -74.0059],
  zoom: 3,
});
lightmap.addTo(map);

// Grab the data with d3
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(response) {
  var earthquake = response.features;

  // Loop through data
  for (var i = 0; i < earthquake.length; i++) {

    // Set the data location property to a variable
    var location = earthquake[i].geometry;
    var info = earthquake[i].properties
    var colour;
    
    const mag = info.mag
    switch (true) {
      case mag >= 5:
        colour = "#D61A46";
        break;
      case mag >= 4:
        colour = "#FD4D0C";
        break;
      case mag >= 3:
        colour = "#FB9902";
        break;
      case mag >= 2:
        colour = "#FDDC22";
        break;
      case mag >= 1:
        colour = "#CBE432";
        break;
      default:
        colour = "#66B032";
    }

    // Add a new marker to the cluster group and bind a pop-up
    var markers = L.circleMarker([location.coordinates[1], location.coordinates[0]], {
      radius: mag*3,
      color: colour
    }).bindPopup("Location: " + info.place + "<br> Magnitude: " + mag ).addTo(map)
  }
})


  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Magnitude</h4>";
    div.innerHTML += '<i style="background: #D61A46"></i><span>5+</span><br>';
    div.innerHTML += '<i style="background: #FD4D0C"></i><span>4-5</span><br>';
    div.innerHTML += '<i style="background: #FB9902"></i><span>3-4</span><br>';
    div.innerHTML += '<i style="background: #FDDC22"></i><span>2-3</span><br>';
    div.innerHTML += '<i style="background: #CBE432"></i><span>1-2</span><br>';
    div.innerHTML += '<i style="background: #66B032"></i><span>0-1</span><br>';
    
  
    return div;
  };
  
  legend.addTo(map);

