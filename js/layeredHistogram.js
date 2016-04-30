var state;

/*
 *  layeredHistogram - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

layeredHistogram = function(_parentElement, _data) {

  this.parentElement = _parentElement;
  this.data = _data;
  this.femaleData = _data.filter(function(item){
    return item.sex=="Female";
  });
  this.maleData = _data.filter(function(item){
    return item.sex=="Male";
  });
  this.activity = selectedActivity(d3.select("#map-type").property("value"));
  this.initVis();

}

function selectedActivity(d) {
  switch (d) {
    case 'Average Work': return "act_work";
    case 'Average Leisure': return "act_leisure";
    case 'Average Personal Care': return "act_pcare";
    case 'Average Educational Time': return "act_educ";
  }
}

/*
 *  Initialize histogram
 */

layeredHistogram.prototype.initVis = function() {

  var vis = this;

  vis.margin = { top: 40, right: 10, bottom: 60, left: 60 };

  vis.width = 400 - vis.margin.left - vis.margin.right,
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
    .domain([0,24]); // 24 hours in a day

  vis.y = d3.scale.linear()
    .range([vis.height, 0]);

  vis.xAxis = d3.svg.axis()
    .scale(vis.x)
    .orient("bottom");

  vis.yAxis = d3.svg.axis()
    .scale(vis.y)
    .orient("left")
    .tickFormat(d3.format("%"));

  vis.svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + vis.height + ")");

  vis.svg.append("g")
    .attr("class", "y-axis axis");

  // label http://bl.ocks.org/phoebebright/3061203
  vis.svg.append("text")
    .attr("class", "title")
    .attr("x", (vis.width / 2))
    .attr("y", 0 - (vis.margin.top / 2))
    .attr("text-anchor", "middle");

  // now add titles to the axes
  vis.svg.append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+(-vis.margin.left/1.5)+","+(vis.height/2)+") rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
      .text("Frequency");

  vis.svg.append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (vis.width/2) +","+(vis.height+vis.margin.bottom/1.5)+")")  // centre below axis
      .text("Number of Hours in a 24-Hour Day");

  // Add a legend d3-legend.susielu.com/#usage
  vis.ordinal = d3.scale.ordinal()
      .domain(["Female", "Male", "Overlap"])
      .range(["rgba(255, 0, 0, 0.5)","rgba(0, 0, 255, 0.5)", "rgb(160, 32, 240)"]);

  vis.svg.append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", "translate("+(vis.width-70)+",0)");

  vis.legendOrdinal = d3.legend.color()
      .shapePadding(10)
      .scale(vis.ordinal);

  vis.svg.select(".legendOrdinal")
      .call(vis.legendOrdinal);

  vis.wrangleData("All States");
}


/*
 *  Data wrangling
 */

layeredHistogram.prototype.wrangleData = function(hoverState) {
  var vis = this;

  // Check if a state is being hovered over
  if(hoverState && hoverState!="All States"){
    state=hoverState;
    vis.displayFemaleData = vis.femaleData.filter(byState)
    vis.displayMaleData = vis.maleData.filter(byState)
  }
  else{
    state="All States"
    vis.displayFemaleData = vis.femaleData;
    vis.displayMaleData = vis.maleData;
  }

  // Update the visualization
  vis.updateVis();

}


/*
 *  The drawing function
 */

layeredHistogram.prototype.updateVis = function() {
  vis = this;

  vis.activity = selectedActivity(d3.select("#map-type").property("value"));

  // Generate a histogram using 24 uniformly-spaced bins.
  //vis.values = d3.layout.histogram()
  //  .frequency(false)
  //  .bins(vis.x.ticks(24))
  //  .value(function(d) { return d[vis.activity]; })
  //  (vis.data);

  // Female data values
  vis.femaleValues = d3.layout.histogram()
    .frequency(false)
    .bins(vis.x.ticks(24))
    .value(function(d) { return d[vis.activity]; })
    (vis.displayFemaleData);

  // Male data values
  vis.maleValues = d3.layout.histogram()
    .frequency(false)
    .bins(vis.x.ticks(24))
    .value(function(d) { return d[vis.activity]; })
    (vis.displayMaleData);

  var femaleMax = d3.max(vis.femaleValues, function(d) { return d.y; });
  var maleMax = d3.max(vis.maleValues, function(d) { return d.y; });
  var yMax = d3.max([femaleMax,maleMax])+.05;

  // Update y domain
  vis.y.domain([0, yMax]);

  vis.bar1 = vis.svg.selectAll(".bar1").data(vis.femaleValues);

  vis.bar1.enter().append("g")
    .attr("class", "bar1")
    .attr("fill", "red")
    .attr("opacity", .5)
    .attr("transform", function(d) { return "translate(" + vis.x(d.x) + "," + vis.y(d.y) + ")"; });

  //vis.bar1.selectAll(".rect1").remove();

  vis.bar1.append("rect")
    .attr("class", "rect1")
    .attr("x", 1)
    .attr("width", vis.x(vis.femaleValues[0].dx) - 1)
    .attr("height", function(d) { return vis.height - vis.y(d.y); });

  // handle updated elements
  vis.bar1
    .transition()
    //.duration(800);
    .attr("transform", function(d) { return "translate(" + vis.x(d.x) + "," + vis.y(d.y) + ")"; });

  //vis.bar1.append("text")
  //  .attr("dy", ".75em")
  //  .attr("y", -15)
  //  .attr("x", vis.x(vis.values[0].dx) / 2)
  //  .attr("text-anchor", "middle")
  //  .attr("fill","black")
  //  .text(function(d) { return vis.formatCount(d.y); });

  vis.bar2 = vis.svg.selectAll(".bar2").data(vis.maleValues);

  vis.bar2.enter().append("g")
    .attr("class", "bar2")
    .attr("fill", "blue")
    .attr("opacity",.5)
    .attr("transform", function(d) { return "translate(" + vis.x(d.x) + "," + vis.y(d.y) + ")"; });

  //vis.bar2.selectAll(".rect2").remove();

  vis.bar2
    .append("rect")
    .attr("class", "rect2")
    .attr("x", 1)
    .attr("width", vis.x(vis.maleValues[0].dx) - 1)
    .attr("height", function(d) { return vis.height - vis.y(d.y); });

  // handle updated elements
  vis.bar2.transition()
    //.duration(800)
    .attr("transform", function(d) { return "translate(" + vis.x(d.x) + "," + vis.y(d.y) + ")"; });

  vis.bar1.exit().remove();
  vis.bar2.exit().remove();

  // remove all child elements except the last one
  for(var i=0; i<vis.bar2.selectAll(".rect2").length; i++){
    if(vis.bar2.selectAll(".rect2")[i].length>1){
      vis.bar2.selectAll(".rect2")[i]["0"].remove();
    }
  }

  // remove all child elements except the last one
  for(var i=0; i<vis.bar1.selectAll(".rect1").length; i++){
    if(vis.bar1.selectAll(".rect1")[i].length>1){
      vis.bar1.selectAll(".rect1")[i]["0"].remove();
    }
  }

  d3.select("#state").text(state);

  // Call axis functions with the new domain
  vis.svg.select(".x-axis").call(vis.xAxis);
  vis.svg.select(".y-axis").call(vis.yAxis).transition().duration(800);


}

function actLabel(act){
  switch (act) {
    case 'act_work': return "Work";
    case 'act_leisure': return "Leisure";
    case 'act_pcare': return "Personal Care";
    case 'act_educ': return "Education";
  }
}

function byState(item) {
  return item.state==state;
}