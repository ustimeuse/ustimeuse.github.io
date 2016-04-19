
/*
 *  BubbleMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

BubbleChart = function(_parentElement, _data) {

  this.parentElement = _parentElement;
  this.data = _data;
  this.initVis();

}


/*
 *  Initialize station map
 */

BubbleChart.prototype.initVis = function() {
  var vis = this;
  console.log("hitting this");
  vis.margin = { top: 40, right: 20, bottom: 60, left: 60 };

  vis.width = 800 - vis.margin.left - vis.margin.right,
    vis.height = 400 - vis.margin.top - vis.margin.bottom;

  // SVG drawing area
  vis.svg = d3.select("#" + vis.parentElement).append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  // Scales and axes
  vis.x = d3.scale.linear()
    .range([0, vis.width])
    .domain(d3.extent(vis.data, function(d) { return d.age; }));

  vis.y = d3.scale.linear()
    .range([vis.height, 0])
    .domain(d3.extent(vis.data, function(d) { return d.act_leisure; }));

  vis.xAxis = d3.svg.axis()
    .scale(vis.x)
    .orient("bottom");

  vis.yAxis = d3.svg.axis()
    .scale(vis.y)
    .orient("left");

  vis.svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + vis.height + ")");

  vis.svg.append("g")
    .attr("class", "y-axis axis");

  // Add circles
  vis.svg.selectAll("circle")
    .data(vis.data)
    .enter()
    .append("circle")
    .attr("fill", function(d){
      return "red";
    })
    .attr("r", function(d){
      return 2;
    })
    .attr("stroke", "black")
    .attr("cx", function(d){
      return vis.x(d.age);
    })
    .attr("cy", function(d) {
      return vis.y(d.act_leisure);
    });

  vis.wrangleData();
}


/*
 *  Data wrangling
 */

BubbleChart.prototype.wrangleData = function() {
  var vis = this;

  // Currently no data wrangling/filtering needed
  vis.displayData = vis.data;

  // Update the visualization
  vis.updateVis();

}


/*
 *  The drawing function
 */

BubbleChart.prototype.updateVis = function() {
  vis = this;

  // Call axis functions with the new domain
  vis.svg.select(".x-axis").call(vis.xAxis);
  vis.svg.select(".y-axis").call(vis.yAxis);
}

