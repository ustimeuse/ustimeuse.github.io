
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

  // Data-join (circle now contains the update selection)
  vis.circle = vis.svg.selectAll("circle").data(vis.data);

  // Enter (initialize the newly added elements)
  vis.circle.enter()
    .append("circle")
    .attr("fill", function(d){
      return incomeColors(d.famincome);
    })
    .attr("r", function(d){
      return 2;
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

  vis.selected_value = d3.select("#plot-type").property("value");

  // Update (set the dynamic properties of the elements)
  vis.circle
    .transition()
    .duration(800)
    .attr("cx", function(d){
      return vis.x(d.age);
    })
    .attr("cy", function(d) {
      console.log("Entering selection?");
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

  vis.labels = ['Less than $5,000',
    '$5,000 to $7,499',
    '$7,500 to $9,999',
    '$10,000 to $12,499',
    '$12,500 to $14,999',
    '$15,000 to $19,999',
    '$20,000 to $24,999',
    '$25,000 to $29,999',
    '$30,000 to $34,999',
    '$35,000 to $39,999',
    '$40,000 to $49,999',
    '$50,000 to $59,999',
    '$60,000 to $74,999',
    '$75,000 to $99,999',
    '$100,000 to $149,999',
    '$150,000 and over',
    'Refused',
    "Don't know",
    "Blank"];

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

  console.log(vis.legend);
}

function incomeColors(d) {
  switch (d) {
    case 'Less than $5,000': return "rgb(245,245,245)";
    case '$5,000 to $7,499': return "rgb(235,235,235)";
    case '$7,500 to $9,999': return "rgb(225,225,225)";
    case '$10,000 to $12,499': return "rgb(215,215,215)";
    case '$12,500 to $14,999': return "rgb(205,205,205)";
    case '$15,000 to $19,999': return "rgb(195,195,195)";
    case '$20,000 to $24,999': return "rgb(175,175,175)";
    case '$25,000 to $29,999': return "rgb(155,155,155)";
    case '$30,000 to $34,999': return "rgb(125,125,125)";
    case '$35,000 to $39,999': return "rgb(115,115,115)";
    case '$40,000 to $49,999': return "rgb(100,100,100)";
    case '$50,000 to $59,999': return "rgb(75,75,75)";
    case '$60,000 to $74,999': return "rgb(55,55,55)";
    case '$75,000 to $99,999': return "rgb(25,25,25)";
    case '$100,000 to $149,999': return "rgb(15,15,15)";
    case '$150,000 and over': return "rgb(0,0,0)";
    case 'Refused': return "rgb(255,255,255)";
    case "Don't know": return "rgb(255,255,255)";
    case "Blank": return "rgb(255,255,255)";
  }
}