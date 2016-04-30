
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

  vis.margin = { top: 40, right: 200, bottom: 60, left: 60 };

  vis.width = 1200 - vis.margin.left - vis.margin.right,
    vis.height = 800 - vis.margin.top - vis.margin.bottom;

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
    .domain(d3.extent(vis.data, function(d) { return d.leisure; }));

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

  // Data-join (circle now contains the update selection)
  vis.circle = vis.svg.selectAll("circle").data(vis.data);

  // Enter (initialize the newly added elements)
  vis.circle.enter()
    .append("circle")
    .attr("fill", function(d){
      return incomeColors(d["income.new"]);
    })
    .attr("r", function(d){
      return 5;
    })
    .attr("stroke", "black");

  vis.addLegend();
  vis.wrangleData();
}


/*
 *  Data wrangling
 */

BubbleChart.prototype.wrangleData = function() {
  var vis = this;

  vis.displayData = vis.data;

  // Update the visualization
  vis.updateVis();

}


/*
 *  The drawing function
 */

BubbleChart.prototype.updateVis = function() {
  vis = this;

  vis.selected_value = d3.select("#plot-type").property("value");
  console.log(vis.selected_value);
  // Update (set the dynamic properties of the elements)
  vis.circle
    .transition()
    .duration(800)
    .attr("cx", function(d){
      return vis.x(d.age);
    })
    .attr("cy", function(d) {
      console.log(d[vis.selected_value]);
      return vis.y(d[vis.selected_value]);
    });

  // Exit
  vis.circle.exit().remove();

  // Call axis functions with the new domain
  vis.svg.select(".x-axis").call(vis.xAxis);
  vis.svg.select(".y-axis").call(vis.yAxis);
}

BubbleChart.prototype.addLegend = function() {
  vis=this;

  vis.labels=["Below $25k","$25k-$50k","$50k-$75k", "$75k-$100k","$100k+"];

  // Create legend
  vis.legend = vis.svg.selectAll('rect')
    .data(vis.labels)
    .enter()
    .append('rect')
    .attr("class", "bubble-rects")
    .attr("x", vis.width+20)
    .attr("y", function(d, i){
      return i*40;
    })
    .attr("width", 20)
    .attr("height", 20)
    .attr("stroke", "black")
    .style("fill", function(d){
      return incomeColors(d);
    });

  // Add labels for legend
  vis.svg.selectAll("text")
    .data(vis.labels)
    .enter()
    .append('text')
    .attr("class", "bubble-labels")
    .attr("x", vis.width+50)
    .attr("y", function(d, i) {
      return i*40+15;
    })
    .text(function(d,i) {
      return vis.labels[i];
    });
}

function incomeColors(d) {

  var color = d3.rgb("green");

  switch (d) {
    case "Below $25k": return "white";
    case "$25k-$50k": return color.brighter(2);
    case "$50k-$75k": return color;
    case "$75k-$100k": return color.darker(2);
    case "$100k+": return color.darker(4);
  }
}