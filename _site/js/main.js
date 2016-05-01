// Global datasets
var data;
var femaleData;
var maleData;

// Set ordinal color scale
var colorScale = d3.scale.category20();

// Variables for the visualization instances
var layeredhistogram;

// use the Queue.js library to read multiple files
queue()
  //.defer(d3.csv, "data/datatouse.csv")
  .defer(d3.csv, "data/yuqi_new.csv")
  .await(analyze);

function analyze(error, dataToUse){

  //dataByState = dataByStateCSV;
  data=dataToUse;

  for(var i=0; i<dataToUse.length; i++){
    data[i].act_educ = Math.round(+dataToUse[i].educ/60);
    data[i].act_leisure = Math.round(+dataToUse[i].leisure/60);
    data[i].act_pcare = Math.round(+dataToUse[i].pcare/60);
    data[i].act_social = Math.round(+dataToUse[i].social/60);
    data[i].act_sports = Math.round(+dataToUse[i].sports/60);
    data[i].act_work = Math.round(+dataToUse[i].work/60);
    data[i].educ_perc = +dataToUse[i].act_educ;
    data[i].leisure_perc = +dataToUse[i].act_leisure;
    data[i].pcare_perc = +dataToUse[i].act_pcare;
    data[i].social_perc = +dataToUse[i].act_social;
    data[i].sports_perc = +dataToUse[i].act_sports;
    data[i].work_perc = +dataToUse[i].act_work;
    data[i].age = +dataToUse[i].age;
  }

  //console.log(dataByState[0]);
  console.log(data[0]);

  // Filter function
  femaleData = data.filter(function(item){
    return item.sex=="Female";
  });

  maleData = data.filter(function(item){
    return item.sex=="Male";
  });

  colorScale.domain(["educ_perc","leisure_perc","pcare_perc","social_perc","sports_perc","work_perc"]);

  createVis()
}

function createVis() {

  // TO-DO: INSTANTIATE VISUALIZATION
  //bubbleChart = new BubbleChart("bubble-chart",data);
  //femalehistogram = new Histogram("female-histogram",femaleData,"act_leisure");
  //malehistogram = new Histogram("male-histogram",maleData,"act_leisure");
  layeredhistogram = new layeredHistogram("overlapping-histogram",data,"act_leisure");
  //areachart = new StackedAreaChart("stacked-area-chart",data);
}

function updateChart(){
  //bubbleChart.updateVis();
  layeredhistogram.wrangleData();
}