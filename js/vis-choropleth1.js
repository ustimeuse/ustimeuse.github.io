/**
 * Created by tle1925 on 4/16/2016.
 */

// --> CREATE SVG DRAWING AREA
var width = 1000,
    height = 400;

var USmap;
var timeuse;

// Map data by states
var dataByStates = d3.map();

queue()
    .defer(d3.json, "data/us-geo.json")
    .defer(d3.csv, "data/choropleth.csv", processData)
    .await(loaded);

var svg = d3.select("#visualization").append("svg")
    .attr("width", width)
    .attr("height", height)

var svg1 = d3.select("#visualization1").append("svg")
    .attr("width", width)
    .attr("height", height);


function processData(d) {
    d.average_work= +d.average_work;
    d.average_leisure= +d.average_leisure;
    return d;
}

function loaded(error,map,data) {
    USmap=map;
    timeuse=data;

    updateMap();
}

var projection = d3.geo.albersUsa()
    .scale(500)
    .translate([width/3, height /4]);

var path = d3.geo.path()
    .projection(projection);


// Create color scale
var colors = ["#fdbb84","#fc8d59","#e34a33","#b30000"];
// set up a scale that can take data values as input, and will return colors
var color = d3.scale.quantize()
  .range(colors);
var color1 = d3.scale.quantize()
    .range(colors);

console.log("Hi");

function updateMap(){

    // Exit previous objects
    s=d3.selectAll("path.countries")
    s.remove();

    s1=d3.selectAll(".rectangles")
    s1.remove()

    s2=d3.selectAll(".legend-labels")
    s2.remove()

    // Get selected value
    selectedValue=d3.select("#map-type").property("value");
    // Get selected value
    selectedValue1=d3.select("#map-type1").property("value");

    var min=d3.min(timeuse, function(d) {return +d[selectedValue]})
    var max=d3.max(timeuse, function(d) {return +d[selectedValue]})
    var min1=d3.min(timeuse, function(d) {return +d[selectedValue1]})
    var max1=d3.max(timeuse, function(d) {return +d[selectedValue1]})

    // Pass in domain for color scale
    //colorScale.domain(d3.range(min, max, (max-min)/colors.length));
    color.domain(d3.range(min, max, (max-min)/colors.length));
    color1.domain(d3.range(min1, max1, (max1-min1)/colors.length));

    // Save these labels for legend
    var leg_labels=d3.range(min, max, (max-min)/colors.length);
    var leg_labels1=d3.range(min1, max1, (max1-min1)/colors.length);
    var US = USmap.features

    // Reference: http://chimera.labs.oreilly.com/books/1230000000345/ch12.html#_choropleth
    // Merge the malaria data and GeoJSON
    for(var i=0; i<timeuse.length; i++){

        //Grab country code, which matches with adm0_a3_is
        var dataCode = timeuse[i].states;

        //Find the corresponding country inside the GeoJSON
        for (var j = 0; j < US.length; j++) {
            var jsonCode = US[j].properties.NAME;
            //console.log(dataCode, jsonCode);
            if (dataCode == jsonCode) {
                //Copy the data value into the JSON
                US[j].properties[selectedValue]= timeuse[i][selectedValue];
                US[j].properties[selectedValue1]= timeuse[i][selectedValue1];
                //Stop looking through the JSON
                break;
            }
        }
    }
    //console.log(US);
    svg.selectAll('path.countries')
        .data(US)
        .enter()
        .append('path')
        .attr('class', 'countries')
        .attr('d', path)
        .attr('fill', function(d,i) {
            return color(d.properties[selectedValue]);
        })

    //console.log(US);
    svg1.selectAll('path.countries')
        .data(US)
        .enter()
        .append('path')
        .attr('class', 'countries')
        .attr('d', path)
        .attr('fill', function(d,i) {
            return color1(d.properties[selectedValue1]);
        })

    // Create legend
    var legend = svg.selectAll('rect')
        .data(leg_labels)
        .enter()
        .append('rect')
        .attr("class", "rectangles")
        .attr("x", 0)
        .attr("y", function(d, i){
            return i*40;
        })
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function(d){
            return color(d);
        });

    // Create legend
    var legend1 = svg1.selectAll('rect')
        .data(leg_labels1)
        .enter()
        .append('rect')
        .attr("class", "rectangles")
        .attr("x", 540)
        .attr("y", function(d, i){
            return i*40;
        })
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function(d){
            return color1(d);
        });

    // Add labels for legend
    svg.selectAll("text")
        .data(leg_labels)
        .enter()
        .append('text')
        .attr("class", "legend-labels")
        .attr("x", 40)
        .attr("y", function(d, i) {
            return i*40+15;
        })
        .text(function(d,i) {
            format=d3.format(".1f")
            if(i<(leg_labels.length-1)){
                return ((format(leg_labels[i]))+ "-" + (format(leg_labels[i+1])));
            }
            return ((format(leg_labels[i])) + "-" + (format(max)));
        });

    // Add labels for legend
    svg1.selectAll("text")
        .data(leg_labels1)
        .enter()
        .append('text')
        .attr("class", "legend-labels")
        .attr("x", 580)
        .attr("y", function(d, i) {
            return i*40+15;
        })
        .text(function(d,i) {
            format=d3.format(".1f")
            if(i<(leg_labels1.length-1)){
                return ((format(leg_labels1[i]))+ "-" + (format(leg_labels1[i+1])));
            }
            return ((format(leg_labels1[i])) + "-" + (format(max1)));
        });


}

