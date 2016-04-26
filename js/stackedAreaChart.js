

/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the
 */

StackedAreaChart = function(_parentElement, _data){
  this.parentElement = _parentElement;
  this.data = _data.sort(function(a, b) {
    return d3.descending(a.age, b.age);
  });
  this.displayData = []; // see data wrangling

  // DEBUG RAW DATA
  //console.log(this.data);

  this.initVis();
}



/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

StackedAreaChart.prototype.initVis = function(){
  var vis = this;

  vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

  vis.width = 800 - vis.margin.left - vis.margin.right,
    vis.height = 400 - vis.margin.top - vis.margin.bottom;


  // SVG drawing area
  vis.svg = d3.select("#" + vis.parentElement).append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  // TO-DO: Overlay with path clipping
  vis.svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", vis.width)
    .attr("height", vis.height);


  // Scales and axes
  vis.x = d3.scale.linear()
    .range([0, vis.width])
    .domain(d3.extent(vis.data, function(d) { return d.age; }));

  vis.y = d3.scale.linear()
    .range([vis.height, 0]);

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


  // TO-DO: Initialize stack layout
  var stack = d3.layout.stack()
    .values(function(d) { return d.values; })
    .order(["inside-out"]);

  // Transpose the data
  var dataCategories = colorScale.domain();

  // Rearrange data into layers
  var transposedData = dataCategories.map(function(name) {
    return {
      name: name,
      values: vis.data.map(function(d) {
        return {age: d.age, y: d[name]};
      })
    };
  });

  vis.stackedData = stack(transposedData);

  // TO-DO: Stacked area layout
  vis.area = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) {return vis.x(d.age); })
    .y0(function(d) { return vis.y(d.y0); })
    .y1(function(d) { return vis.y(d.y0 + d.y); });

  // TO-DO: Tooltip placeholder
  vis.tooltip = vis.svg.append("text")
    .attr("x", 10)
    .attr("y", 10);

  // TO-DO: (Filter, aggregate, modify data)
  vis.wrangleData();
}



/*
 * Data wrangling
 */

StackedAreaChart.prototype.wrangleData = function(){
  var vis = this;

  // In the first step no data wrangling/filtering needed
  vis.displayData = vis.stackedData;

  // Update the visualization
  vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

StackedAreaChart.prototype.updateVis = function(){
  var vis = this;

  // Update domain
  // Get the maximum of the multi-dimensional array or in other words, get the highest peak of the uppermost layer
  vis.y.domain([0, d3.max(vis.displayData, function(d) {
    return d3.max(d.values, function(e) {
      return e.y0 + e.y;
    });
  })
  ]);


  // Draw the layers
  var categories = vis.svg.selectAll(".area")
    .data(vis.displayData);

  categories.enter().append("path")
    .attr("class", "area")
    .on('mouseover', function(d) {
      vis.tooltip.text(d.name);
    })
    .on('mouseout',function(d) {
      vis.tooltip.text("");
    });

  categories
    .style("fill", function(d) {
      console.log(colorScale(d.name));
      return colorScale(d.name);
    })
    .attr("d", function(d) {
      //console.log(vis.area(d.values));
      return vis.area(d.values);
    })

  // TO-DO: Update tooltip text

  categories.exit().remove();


  // Call axis functions with the new domain
  vis.svg.select(".x-axis").call(vis.xAxis);
  vis.svg.select(".y-axis").call(vis.yAxis);
}
