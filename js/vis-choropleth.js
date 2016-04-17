/**
 * Created by tle1925 on 4/16/2016.
 */

// --> CREATE SVG DRAWING AREA
var width = 1600,
    height = 1000;

var USmap;
var timeuse;

queue()
    .defer(d3.json, "data/us-10m.json")
    .defer(d3.csv, "data/yuqi.csv")
    .await(loaded);

var svg = d3.select("#visualization").append("svg")
    .attr("width", width)
    .attr("height", height);

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



function updateMap(){
    var US = topojson.feature(USmap, USmap.objects.states).features;
    svg.selectAll('path.countries')
        .data(US)
        .enter()
        .append('path')
        .attr('class', 'countries')
        .attr('d', path)
        .attr('fill', "black")
}

