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

  // TO-DO: INSTANTIATE VISUALIZATION
  bubbleChart = new BubbleChart("bubble-chart",data);

}

function updateChart(){
  bubbleChart.updateVis();
}