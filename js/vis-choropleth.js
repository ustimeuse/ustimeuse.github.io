/**
 * Created by tle1925 on 4/16/2016.
 */

// --> CREATE SVG DRAWING AREA
var width = 1600,
    height = 1000;

var USmap;
var timeuse;

// Map data by states
var dataByStates = d3.map();

queue()
    .defer(d3.json, "data/state.json")
    .defer(d3.csv, "data/choropleth.csv", processData)
    .await(loaded);

var svg = d3.select("#visualization").append("svg")
    .attr("width", width)
    .attr("height", height);

function processData(d) {
    d.average_work= +d.average_work;
    d.average_leisure= +d.average_leisure;
    dataByStates.set(d.states, d); // map data by states
    return d;
}

function loaded(error,map,data) {
    USmap=map;
    timeuse=data;
    console.log(timeuse);
    console.log(USmap);
    updateMap();
}

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

// Create color scale
var colors = ["#fdbb84","#fc8d59","#e34a33","#b30000"];
var colorScale =d3.scale.linear().range(colors);

// Color map, Return gray if data is missing
function getColor(d) {
    var dataRow =dataByStates.get(d.properties.NAME10);
    console.log(dataRow);
    return colorScale(dataRow["average_work"]);
}

function updateMap(){

    var min=d3.min(timeuse, function(d) {return +d["average_work"]})
    var max=d3.max(timeuse, function(d) {return +d["average_work"]})

    // Pass in domain for color scale
    colorScale.domain(d3.range(min, max, (max-min)/colors.length));

    // Save these labels for legend
    var leg_labels=d3.range(min, max, (max-min)/colors.length);
    console.log(leg_labels)

    //console.log(USmap);
    var US = topojson.feature(USmap, USmap.features).features;
    console.log(USmap);
    svg.selectAll('path.countries')
        .data(US)
        .enter()
        .append('path')
        .attr('class', 'countries')
        .attr('d', path)
        .attr('fill', function(d,i) {
            return getColor(d);
        })

    // Create legend
    var legend = svg.selectAll('rect')
        .data(leg_labels)
        .enter()
        .append('rect')
        .attr("class", "rectangles")
        .attr("x", 100)
        .attr("y", function(d, i){
            return i * 40;
        })
        .attr("width", 30)
        .attr("height", 30)
        .style("fill", function(d){
            return colorScale(d);
        });

    // Add labels for legend
    svg.selectAll("text")
        .data(leg_labels)
        .enter()
        .append('text')
        .attr("class", "legend-labels")
        .attr("x", 150)
        .attr("y", function(d, i) {
            return i * 40+20;
        })
        .text(function(d,i) {
            format=d3.format(".1f")
            if(i<(leg_labels.length-1)){
                return ((format(leg_labels[i]))+ "-" + (format(leg_labels[i+1])));
            }
            return ((format(leg_labels[i])) + "-" + (format(max)));
        });


}

