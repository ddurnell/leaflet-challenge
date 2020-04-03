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
    var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    // Creating map object
    var myMap = L.map("map", {
        center: [34.05, -118.24], // los angeles
        zoom: 4, // pretty wide
        layers: [streets, quakes]
    });
}


function chooseColor(mag){
    switch(true){
        case (mag<1):
            return "green";
        case (mag<2):
            return "greenyellow";
        case (mag<3):
            return "gold";
        case (mag<4):
            return "DarkOrange";
        case (mag<5):
            return "Peru";
        default:
            return "red";
    };
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
    



