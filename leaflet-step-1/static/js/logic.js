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
    
    // // Add the layer control to the map
    // L.control.layers(baseMaps, overlayMaps, {
    //     collapsed: false
    //   }).addTo(myMap);
  
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
    
function displayLegend(){
    var legendInfo = [{
        limit: "Mag: 0-1",
        color: "green"
    },{
        limit: "Mag: 1-2",
        color: "greenyellow"
    },{
        limit:"Mag: 2-3",
        color:"gold"
    },{
        limit:"Mag: 3-4",
        color:"DarkOrange"
    },{
        limit:"Mag: 4-5",
        color:"Peru"
    },{
        limit:"Mag: 5+",
        color:"red"
    }];

    var strng = "";
   
    for (i = 0; i < legendInfo.length; i++){
        strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
    }
    
    return strng;

}


