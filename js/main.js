// Global datasets
var data;
var femaleData;
var maleData;

// Set ordinal color scale
var colorScale = d3.scale.category20();

// Variables for the visualization instances
var areachart, femalehistogram, malehistogram;

// use the Queue.js library to read multiple files
queue()
  .defer(d3.csv, "data/datatouse.csv")
  .await(analyze);

function analyze(error, dataToUse){
  console.log(dataToUse);

  data=dataToUse;

  for(var i=0; i<dataToUse.length; i++){
    data[i].act_educ = Math.round(+dataToUse[i].act_educ/60);
    data[i].act_leisure = Math.round(+dataToUse[i].act_leisure/60);
    data[i].act_pcare = Math.round(+dataToUse[i].act_pcare/60);
    data[i].act_social = Math.round(+dataToUse[i].act_social/60);
    data[i].act_sports = Math.round(+dataToUse[i].act_sports/60);
    data[i].act_work = Math.round(+dataToUse[i].act_work/60);
    data[i].educ_perc = +dataToUse[i].act_educ;
    data[i].leisure_perc = +dataToUse[i].act_leisure;
    data[i].pcare_perc = +dataToUse[i].act_pcare;
    data[i].social_perc = +dataToUse[i].act_social;
    data[i].sports_perc = +dataToUse[i].act_sports;
    data[i].work_perc = +dataToUse[i].act_work;
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
  femalehistogram = new Histogram("female-histogram",femaleData,"act_leisure");
  malehistogram = new Histogram("male-histogram",maleData,"act_leisure");
  femalehistogram2 = new Histogram("female-histogram-work",femaleData,"act_work");
  malehistogram2 = new Histogram("male-histogram-work",maleData,"act_work");
  areachart = new StackedAreaChart("stacked-area-chart",data);
}

function updateChart(){
  //bubbleChart.updateVis();
}