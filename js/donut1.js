var gender = { label: 'Gender', pct: [49.45,50.55,0,0,0]},
    race = { label: 'Race',   pct: [11.4,80.4,5.5,2.7,0]},
    income = { label: 'Income',   pct: [14.2,23.9, 20.3, 15.4, 26.2]},
    employment = { label: 'Employment', pct: [82.5,17.5,0,0,0]};
    data = gender;

var labels={Gender: ["Female","Male"], Race: ["Black only","White only","Asian only", "Mixed"],
    Income: ["Below $25k","$25k-$50k","$50k-$75k", "$75k-$100k","$100k+"], Employment: ["Full Time", "Part Time"]};

var w = 320,                       // width and height, natch
    h = 320,
    r = Math.min(w, h) / 2,        // arc radius
    dur = 750,                     // duration, in milliseconds
    color = d3.scale.category10(),
    donut = d3.layout.pie().sort(null),
    arc = d3.svg.arc().innerRadius(r - 70).outerRadius(r - 20);

// ---------------------------------------------------------------------
var svg = d3.select("#show_data").append("svg:svg")
    .attr("width", w).attr("height", h);

var arc_grp = svg.append("svg:g")
    .attr("class", "arcGrp")
    .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

var label_group = svg.append("svg:g")
    .attr("class", "lblGroup")
    .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

// GROUP FOR CENTER TEXT
var center_group = svg.append("svg:g")
    .attr("class", "ctrGroup")
    .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

// CENTER LABEL
var pieLabel = center_group.append("svg:text")
    .attr("dy", ".35em").attr("class", "chartLabel")
    .attr("text-anchor", "middle")
    .text(data.label);

// DRAW ARC PATHS
var arcs = arc_grp.selectAll("path")
    .data(donut(data.pct));

arcs.enter().append("svg:path")
    .attr("stroke", "white")
    .attr("stroke-width", 0.5)
    .attr("fill", function(d, i) {return color(i);})
    .attr("d", arc)
    .each(function(d) {this._current = d});

// DRAW SLICE LABELS
var sliceLabel = label_group.selectAll("text")
    .data(donut(data.pct));

sliceLabel.enter().append("svg:text")
    .attr("class", "arcLabel")
    .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")"; })
    .attr("text-anchor", "middle")
    .text(function(d, i) {return labels["Gender"][i]; });

// --------- "PAY NO ATTENTION TO THE MAN BEHIND THE CURTAIN" ---------

// Store the currently-displayed angles in this._current.
// Then, interpolate from this._current to the new angles.
function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    };
}

updateInfo(data);

// update chart
function updateChart(model) {

    data = eval(model); // which model?
    //console.log(data);
    //console.log(data.label)
    //console.log(labels[data.label][1]);

    arcs.data(donut(data.pct)); // recompute angles, rebind data
    arcs.transition().ease("elastic").duration(dur).attrTween("d", arcTween);
    arcs.on("mouseover",function(d,i) {return data.pct[i]});

    sliceLabel.data(donut(data.pct));
    sliceLabel.transition().ease("elastic").duration(dur)
        .attr("transform", function(d) {return "translate(" + arc.centroid(d)+ ")"; })
        .style("fill-opacity", function(d) {return d.value==0 ? 1e-6 : 1;})
        .text(function(d, i) {return labels[data.label][i];})


    updateInfo(data);


    pieLabel.text(data.label);
}

// click handler
$("#donut a").click(function() {
    updateChart(this.href.slice(this.href.indexOf('#') + 1));
    updatePath(this.href.slice(this.href.indexOf('#') + 1));
});

function updateInfo(data){

    var summary="";
    for (i=0; i<labels[data.label].length; i++ ){
        summary = summary + "<li>" + labels[data.label][i] + ": " + data.pct[i] +"%</li>";
    }
    document.getElementById("updateInfo").innerHTML=summary;
}