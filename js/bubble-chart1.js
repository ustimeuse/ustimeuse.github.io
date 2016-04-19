var data;

// use the Queue.js library to read multiple files
queue()
  .defer(d3.csv, "data/filtered-data.csv")
  .defer(d3.csv, "data/final-data.csv")
  .defer(d3.csv, "data/datatouse.csv")
  .await(analyze);

function analyze(error, filteredData, allData, dataToUse){
  console.log(dataToUse);

  data=dataToUse;

  for(var i=0; i<dataToUse.length; i++){
    data[i].act_educ = +dataToUse[i].act_educ;
    data[i].act_leisure = +dataToUse[i].act_leisure;
    data[i].act_pcare = +dataToUse[i].act_pcare;
    data[i].act_social = +dataToUse[i].act_social;
    data[i].act_sports = +dataToUse[i].act_sports;
    data[i].act_work = +dataToUse[i].act_work;
    data[i].age = +dataToUse[i].age;
  }

  console.log(data[0]);
  createVis()
}

function createVis() {

// SVG Size
var width = 800;
var height = 500;
var padding = 65;

// Add svg element (drawing space)
var svg = d3.select("#bubble-chart").append("svg")
  .attr("width", width)
  .attr("height", height);

// Create income scale for x-axis
var minIncome = d3.min(data, function(d) {
  return d.age;
});
var maxIncome = d3.max(data, function(d) {
  return d.age;
});
var incomeScale = d3.scale.log()
  .domain([minIncome,maxIncome])
  .range([padding, width-padding]);

// Create life expectancy scale for y-axis
var minLE = d3.min(data, function(d) {
  return d.act_leisure;
});
var maxLE = d3.max(data, function(d) {
  return d.act_leisure;
});
var lifeExpectancyScale = d3.scale.linear()
  .domain([minLE,maxLE])
  .range([height-padding, padding]);

// Add circles
svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("fill", function(d){
    return "red";
  })
  .attr("r", function(d){
    if(d.famincome)
    return 2;
  })
  .attr("stroke", "black")
  .attr("cy", function(d){
    return lifeExpectancyScale(d.act_leisure);
  })
  .attr("cx", function(d) {
    return incomeScale(d.age);
  });

// Create a generic axis function
var xAxis = d3.svg.axis();
// Pass in the scale function
xAxis.scale(incomeScale).tickFormat(d3.format(",d"));
// Specifiy orientation (top, bottom, left, right)
xAxis.orient("bottom");

// Create y axis
var yAxis = d3.svg.axis();
yAxis.scale(lifeExpectancyScale);
yAxis.orient("left");

// Group element with 'transform' attribute
// x = 0, y = 480 (...moves the whole group 0px to the right and 780px down)
var xgroup = svg.append("g")
  .attr("transform", "translate(0, 440)");
var ygroup = svg.append("g")
  .attr("transform", "translate(60, 0)");

// Add axis to svg
xgroup.attr("class", "axis x-axis").call(xAxis);
// Draw the axis
ygroup.attr("class", "axis y-axis").call(yAxis);

  // TO-DO: INSTANTIATE VISUALIZATION
  //bubbleChart = new BubbleChart("bubble-chart",data);

}
