// use the Queue.js library to read multiple files
queue()
  .defer(d3.csv, "data/filtered-data.csv")
  .defer(d3.csv, "data/final-data.csv")
  .defer(d3.csv, "data/datatouse.csv")
  .await(analyze);

function analyze(error, filteredData, allData, data){
  console.log(filteredData);
  console.log(allData);
  console.log(data);
}