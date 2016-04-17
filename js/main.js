var data;

// use the Queue.js library to read multiple files
queue()
  .defer(d3.csv, "data/filtered-data.csv")
  .defer(d3.csv, "data/final-data.csv")
  .defer(d3.csv, "data/datatouse.csv")
  .await(analyze);

function analyze(error, filteredData, allData, dataToUse){
  console.log(filteredData);
  console.log(allData);
  console.log(datatouse);
  data=dataToUse;

  createVis()
}

function createVis() {

  // TO-DO: INSTANTIATE VISUALIZATION
  bubbleChart = new BubbleChart("bubble-map",data);

}
