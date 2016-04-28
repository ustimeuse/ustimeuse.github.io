var pdata;
var ppath;

d3.csv("data/group-avgs.csv", function(error, csv) {
  var data = csv;

  for(var i=0; i<data.length; i++){
    data[i].educ = +data[i].educ;
    data[i].leisure = +data[i].leisure;
    data[i].pcare = +data[i].pcare;
    data[i].social = +data[i].social;
    data[i].sports = +data[i].sports;
    data[i].work = +data[i].work;
  }

  pdata=data;

  createVis();
});

// from http://bl.ocks.org/jasondavies/1341281
function createVis() {
  var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {},
    dragging = {};

  var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

  var svg = d3.select("#parallel-coordinates").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(pdata[0]).filter(function(d) {
    return d != "Group.1" && d != "type" && (y[d] = d3.scale.linear()
        .domain(d3.extent(pdata, function(p) { return +p[d]; }))
        .range([height, 0]));
  }));

  // Add grey background lines for context.
  background = svg.append("g")
    .attr("class", "background")
    .selectAll("path")
    .data(pdata)
    .enter().append("path")
    .attr("d", path);

  //console.log($("a:checked"));

  var displayData = pdata.filter(function(item){
    return (item["Group.1"]=="Female" || item["Group.1"]=="Male");
  })

  //console.log(displayData);

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(displayData)
    .enter().append("path")
    .attr("class", "forepath")
    .attr("stroke", function(d, i) {return color(i);})
    .attr("d", path);

  ppath=foreground["0"]["0"];

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return {x: x(d)}; })
      .on("dragstart", function(d) {
        dragging[d] = x(d);
        background.attr("visibility", "hidden");
      })
      .on("drag", function(d) {
        dragging[d] = Math.min(width, Math.max(0, d3.event.x));
        foreground.attr("d", path);
        dimensions.sort(function(a, b) { return position(a) - position(b); });
        x.domain(dimensions);
        g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
      })
      .on("dragend", function(d) {
        delete dragging[d];
        transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
        transition(foreground).attr("d", path);
        background
          .attr("d", path)
          .transition()
          .delay(500)
          .duration(0)
          .attr("visibility", null);
      }));

  // Add an axis and title.
  g.append("g")
    .attr("class", "axis")
    .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function(d) { return d; });

  // Add and store a brush for each axis.
  g.append("g")
    .attr("class", "brush")
    .each(function(d) {
      d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
    })
    .selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);

  function position(d) {
    var v = dragging[d];
    return v == null ? x(d) : v;
  }

  function transition(g) {
    return g.transition().duration(500);
  }

  // Returns the path for a given data point.
  function path(d) {
    return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
  }

  function brushstart() {
    d3.event.sourceEvent.stopPropagation();
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
    foreground.style("display", function(d) {
      return actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? null : "none";
    });
  }

}

function updatePath(selectedValue) {

  var displayData = pdata.filter(function(item){
    return (item["type"]==selectedValue);
  });

  //d3.select("#parallel-coordinates").remove();
  var lines = d3.select("#parallel-coordinates").selectAll("*");

  lines.remove();

  // Add blue foreground lines for focus.
  //lines
  //  .selectAll("path")
  //  .data(displayData)
  //  .enter().append("path")
  //  .attr("class", "forepath")
  //  .attr("stroke", function(d, i) {return color(i);})
  //  .attr("d", path);
  //var lines = svg.selectAll(".forepath").data(displayData);
  //
  //
  //lines
  //  .enter().append("path")
  //  .attr("class", "forepath")
  //  .attr("stroke", function(d, i) {return color(i);})
  //  .attr("d", ppath);
  //
  //
  //lines.transition().duration(1100)
  //  .attr("stroke", "red");

  //lines.exit().remove();
  var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {},
    dragging = {};

  var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

  var svg = d3.select("#parallel-coordinates").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(pdata[0]).filter(function(d) {
    return d != "Group.1" && d != "type" && (y[d] = d3.scale.linear()
        .domain(d3.extent(pdata, function(p) { return +p[d]; }))
        .range([height, 0]));
  }));

  // Add grey background lines for context.
  background = svg.append("g")
    .attr("class", "background")
    .selectAll("path")
    .data(pdata)
    .enter().append("path")
    .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
    .attr("class", "foreground")
    .selectAll("path.forepath")
    .data(displayData)
    .enter().append("path")
    .attr("class", "forepath")
    .attr("stroke", function(d, i) {return color(i);})
    .attr("d", path);

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return {x: x(d)}; })
      .on("dragstart", function(d) {
        dragging[d] = x(d);
        background.attr("visibility", "hidden");
      })
      .on("drag", function(d) {
        dragging[d] = Math.min(width, Math.max(0, d3.event.x));
        foreground.attr("d", path);
        dimensions.sort(function(a, b) { return position(a) - position(b); });
        x.domain(dimensions);
        g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
      })
      .on("dragend", function(d) {
        delete dragging[d];
        transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
        transition(foreground).attr("d", path);
        background
          .attr("d", path)
          .transition()
          .delay(500)
          .duration(0)
          .attr("visibility", null);
      }));

  // Add an axis and title.
  g.append("g")
    .attr("class", "axis")
    .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function(d) { return d; });

  // Add and store a brush for each axis.
  g.append("g")
    .attr("class", "brush")
    .each(function(d) {
      d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
    })
    .selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);

  function position(d) {
    var v = dragging[d];
    return v == null ? x(d) : v;
  }

  function transition(g) {
    return g.transition().duration(500);
  }

  // Returns the path for a given data point.
  function path(d) {
    return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
  }

  function brushstart() {
    d3.event.sourceEvent.stopPropagation();
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
    foreground.style("display", function(d) {
      return actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? null : "none";
    });
  }


}
