
/*
 *  Histogram - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

Histogram = function(_parentElement, _data) {

  this.parentElement = _parentElement;
  this.data = _data;
  this.initVis();

}


/*
 *  Initialize histogram
 */

Histogram.prototype.initVis = function() {

  var vis = this;

  // A formatter for counts.
  vis.formatCount = d3.format(",.0f");

  vis.margin = { top: 40, right: 200, bottom: 60, left: 60 };

  vis.width = 700 - vis.margin.left - vis.margin.right,
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

  // SVG drawing area
  vis.svg = d3.select("#" + vis.parentElement).append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  // Scales and axes
  vis.x = d3.scale.linear()
    .range([0, vis.width])
    .domain([0,24]); // 24 hours in a day

  // Generate a histogram using 24 uniformly-spaced bins.
  vis.values = d3.layout.histogram()
    .bins(vis.x.ticks(24))
    .value(function(d) { return d.act_leisure; })
    (vis.data);

  vis.y = d3.scale.linear()
    .domain([0, d3.max(vis.values, function(d) { return d.y; })])
    .range([height, 0]);

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

  vis.bar = vis.svg.selectAll(".bar").data(vis.values);

  vis.bar.enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + vis.x(d.x) + "," + vis.y(d.y) + ")"; });

  vis.bar.append("rect")
    .attr("x", 1)
    .attr("width", vis.x(vis.values[0].dx) - 1)
    .attr("height", function(d) { return vis.height - vis.y(d.y); });

  vis.bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", vis.x(vis.values[0].dx) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return vis.formatCount(d.y); });

  vis.wrangleData();
}


/*
 *  Data wrangling
 */

Histogram.prototype.wrangleData = function() {
  var vis = this;

  vis.displayData = vis.data;

  // Update the visualization
  vis.updateVis();

}


/*
 *  The drawing function
 */

Histogram.prototype.updateVis = function() {
  vis = this;

  vis.selected_value = d3.select("#plot-type").property("value");

  // Update (set the dynamic properties of the elements)
  //vis.circle
  //  .transition()
  //  .duration(800)
  //  .attr("cx", function(d){
  //    return vis.x(d.age);
  //  })
  //  .attr("cy", function(d) {
  //    return vis.y(d[vis.selected_value]);
  //  });
  //
  //// Exit
  //vis.circle.exit().remove();

  // Call axis functions with the new domain
  vis.svg.select(".x-axis").call(vis.xAxis);
  vis.svg.select(".y-axis").call(vis.yAxis);
}
