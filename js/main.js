// Global datasets
var data;
var femaleData;
var maleData;

// Set ordinal color scale
var colorScale = d3.scale.category20();

// Variables for the visualization instances
var areachart, histogram;

// use the Queue.js library to read multiple files
queue()
  .defer(d3.csv, "data/female.csv")
  .defer(d3.csv, "data/male.csv")
  .defer(d3.csv, "data/datatouse.csv")
  .await(analyze);

function analyze(error, female, male, dataToUse){
  console.log(dataToUse);

  data=dataToUse;
  femaleData=female;
  maleData=male;

  for(var i=0; i<dataToUse.length; i++){
    data[i].act_educ = Math.round(+dataToUse[i].act_educ/60);
    data[i].act_leisure = Math.round(+dataToUse[i].act_leisure/60);
    data[i].act_pcare = Math.round(+dataToUse[i].act_pcare/60);
    data[i].act_social = Math.round(+dataToUse[i].act_social/60);
    data[i].act_sports = Math.round(+dataToUse[i].act_sports/60);
    data[i].act_work = Math.round(+dataToUse[i].act_work/60);
    data[i].educ_mins = +dataToUse[i].act_educ;
    data[i].leisure_mins = +dataToUse[i].act_leisure;
    data[i].pcare_mins = +dataToUse[i].act_pcare;
    data[i].social_mins = +dataToUse[i].act_social;
    data[i].sports_mins = +dataToUse[i].act_sports;
    data[i].work_mins = +dataToUse[i].act_work;
    data[i].age = +dataToUse[i].age;
  }
  //
  //for(var i=0; i<female.length; i++){
  //  data[i].act_educ = +female[i].act_educ;
  //  data[i].act_leisure = +dataToUse[i].act_leisure;
  //  data[i].act_pcare = +dataToUse[i].act_pcare;
  //  data[i].act_social = +dataToUse[i].act_social;
  //  data[i].act_sports = +dataToUse[i].act_sports;
  //  data[i].act_work = +dataToUse[i].act_work;
  //  data[i].age = +dataToUse[i].age;
  //}

  //for(var i=0; i<male.length; i++){
  //  data[i].act_educ = +dataToUse[i].act_educ;
  //  data[i].act_leisure = +dataToUse[i].act_leisure;
  //  data[i].act_pcare = +dataToUse[i].act_pcare;
  //  data[i].act_social = +dataToUse[i].act_social;
  //  data[i].act_sports = +dataToUse[i].act_sports;
  //  data[i].act_work = +dataToUse[i].act_work;
  //  data[i].age = +dataToUse[i].age;
  //}

  colorScale.domain(["educ_mins","leisure_mins","pcare_mins","social_mins","sports_mins","work_mins"]);

  createVis()
}

function createVis() {

  // TO-DO: INSTANTIATE VISUALIZATION
  //bubbleChart = new BubbleChart("bubble-chart",data);
  histogram = new Histogram("my-histogram",data);
  areachart = new StackedAreaChart("stacked-area-chart",data);
}

function updateChart(){
  //bubbleChart.updateVis();
}