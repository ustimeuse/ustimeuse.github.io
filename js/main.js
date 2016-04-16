// use the Queue.js library to read multiple files
queue()
  .defer(d3.csv, "data/atus_rost0314_small.csv")
  .defer(d3.csv, "data/atus_resp0314_small.csv")
  .defer(d3.csv, "data/atussum_0314_small.csv")
  .defer(d3.csv, "data/atus_act0314_small.csv")
  .await(analyze);

function analyze(error, roster, response, summary, activity){
  console.log("Roster");
  console.log(roster);
  console.log("Response");
  console.log(response);
  console.log("Summary");
  console.log(summary);
  console.log("Activity");
  console.log(activity);
}