// GET THE DATA AND DO STUFF
// starting dataset
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Get the response
d3.json(url, function(data) {
    // console.log(data);

    var quakes = L.geoJSON(data, {
        // make the popups
        onEachFeature: function(feature, layer){
            layer.bindPopup("Place:"+feature.properties.place + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
        },
        // make the markers
        pointToLayer: makeMarker
    });

    // make the map
    createMap(quakes);
});

// HELPER FUNCTIONS
// make the map
function createMap(quakes) {
    // Adding tile layer to the map
    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    // Hold our base layers
    var baseMaps = {
        "Outdoors": outdoors
      };
    
      // Create overlay object to hold our overlay layer
      var overlayMaps = {
        Earthquakes: quakes
      };

    // Create initial map
    var myMap = L.map("map", {
        center: [34.05, -118.24], // los angeles
        zoom: 4, // pretty wide
        layers: [outdoors, quakes]
    });
      
    // Add a legend
    var info = L.control({
        position: "bottomright"
    });
    info.onAdd = function(){
        var div = L.DomUtil.create("div","legend");
        return div;
    }
    info.addTo(myMap);
    document.querySelector(".legend").innerHTML=displayLegend();
};

// Create a single marker for each feacher
function makeMarker(feature, location){
    let mag = feature.properties.mag;
    let options = {
        radius: mag * 3, // make it relative to significance
        fillColor: chooseColor(mag),
        color: "black", // outline
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6 // overlappability
    }
    return L.circleMarker(location, options);
};

var graphInfo = [{
    limit: 1,
    label: "Mag: 0-1",
    color: "green"
},
{
    limit: 2,
    label: "Mag: 1-2",
    color: "greenyellow"
},
{
    limit: 3,
    label: "Mag: 2-3",
    color: "gold"
},
{
    limit: 4,
    label: "Mag: 3-4",
    color: "DarkOrange"
},
{
    limit: 5,
    label: "Mag: 4-5",
    color: "Peru"
},
{
    limit: 10,
    label: "Mag: 5+",
    color: "red"
}];

function chooseColor(mag){
    switch (true) {
        case (mag <= graphInfo[0].limit):
            return "green";
        case (mag <= graphInfo[1].limit):
            return "greenyellow";
        case (mag <= graphInfo[2].limit):
            return "gold";
        case (mag <= graphInfo[3].limit):
            return "DarkOrange";
        case (mag <= graphInfo[4].limit):
            return "Peru";
        default:
            return "red";
    };
};


function displayLegend(){
    var strng = "<p";
    for (i = 0; i < graphInfo.length; i++){
        strng += "<p style = \"background-color: "+graphInfo[i].color+"\">"+graphInfo[i].label+"</p> ";
    }
    return strng;
}


