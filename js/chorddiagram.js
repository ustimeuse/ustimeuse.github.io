/*********************/
/*  CHORD DIAGRAM    */
/*********************/

var act_codes = [
    {"index": "0", "short": "Sleeping", "desc": "Sleeping"},
    {"index": "1", "short": "Personal Care & Tasks", "desc": "Personal Care"},
    {"index": "2", "short": "Eat/Drink & Shopping", "desc": "Eating and Drinking"},
    {"index": "3", "short": "Education", "desc": "Education"},
    {"index": "4", "short": "Work", "desc": "Work and Work-Related Activities"},
    {"index": "5", "short": "Housework", "desc": "Household Activities"},
    {"index": "6", "short": "Volunteer / Care for Others", "desc": "Care for others / Volunteer Activities"},
    {"index": "7", "short": "Leisure / Sports", "desc": "Socializing, Relaxing, Leisure, Sports, Exercise, and Recreation"},
    {"index": "8", "short": "Religion", "desc": "Religious and Spiritual Activities"},
    {"index": "9", "short": "Misc.", "desc": "Telephone Calls, Other"},
    {"index": "10", "short": "Traveling", "desc": "Traveling"}
];

//*******************************************************************
//  CREATE MATRIX AND MAP
//*******************************************************************

d3.csv('data/chordmatrix.csv', function (error, data) {
    var mpr = chordMpr(data);

    mpr
        .addValuesToMap('current')
        .setFilter(function (row, a, b) {
            return (row.current === a.name && row.next === b.name)
        })
        .setAccessor(function (recs, a, b) {
            if (!recs[0]) return 0;
            return +recs[0].count;
        });
    drawChords(mpr.getMatrix(), mpr.getMap());
});
//*******************************************************************
//  DRAW THE CHORD DIAGRAM
//*******************************************************************
function drawChords (matrix, mmap) {
    var w = 980, h = 800, r1 = h / 2, r0 = r1 - 100;

    var fill = d3.scale.category10();

    var chord = d3.layout.chord()
        .padding(.02)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending);

    var arc = d3.svg.arc()
        .innerRadius(r0)
        .outerRadius(r0 + 20);

    var svg = d3.select("#diagram").append("svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("id", "circle")
        .attr("transform", "translate(" + w / 1.9 + "," + h / 2 + ")");

    svg.append("circle")
        .attr("r", r0 + 20)
        .attr("transform", "translate(50,0)");

    var rdr = chordRdr(matrix, mmap);
    chord.matrix(matrix);

    var g = svg.selectAll("g.group")
        .data(chord.groups())
        .enter().append("svg:g")
        .attr("class", "group")
        .on("mouseover", mouseover)
        .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });

    g.append("svg:path")
        .style("stroke", "none")
        .style("fill", function(d) { return fill(d.index); })
        .attr("d", arc);

    g.append("svg:text")
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (r0 + 26) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) { return act_codes[rdr(d).gname].short; });

    var chordPaths = svg.selectAll("path.chord")
        .data(chord.chords())
        .enter().append("svg:path")
        .attr("class", "chord")
        .style("stroke", function(d) { return d3.rgb(fill(d.target.index)).darker(); })
        .style("fill", function(d) { return fill(d.target.index); })
        .attr("d", d3.svg.chord().radius(r0))
        .on("mouseover", function (d) {
            d3.select("#tooltip")
                .style("visibility", "visible")
                .html(chordTip(rdr(d)))
                .style("top", function () { return (d3.event.pageY - 100)+"px"})
                .style("left", function () { return (d3.event.pageX - 100)+"px";})
        })
        .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });

    function chordTip (d) {
        var p = d3.format(".0%");
        q = d3.format("0d");
        return act_codes[d.sname].short + " &#8594; " + act_codes[d.tname].short + ":<br>"
            + q(d.svalue) + " occurrences<br>" + act_codes[d.tname].short + " &#8594; " +
            act_codes[d.sname].short + ":<br>" + q(d.tvalue) + " occurrences"
    }

    function groupTip (d) {
        return act_codes[d.gname].short + "<br>" + d.gvalue.toFixed() + " total occurences";
    }


    function mouseover(d, i) {
        d3.select("#tooltip")
            .style("visibility", "visible")
            .html(groupTip(rdr(d)))
            .style("top", function () { return (d3.event.pageY - 80)+"px"})
            .style("left", function () { return (d3.event.pageX - 130)+"px";})

        chordPaths.classed("fade", function(p) {
            return p.source.index != i
                && p.target.index != i;
        });
    }
}

//*******************************************************************
//  CHORD MAPPER
//*******************************************************************
function chordMpr (data) {
    var mpr = {}, mmap = {}, n = 0,
        matrix = [], filter, accessor;

    mpr.setFilter = function (fun) {
        filter = fun;
        return this;
    },
        mpr.setAccessor = function (fun) {
            accessor = fun;
            return this;
        },
        mpr.getMatrix = function () {
            matrix = [];
            _.each(mmap, function (a) {
                if (!matrix[a.id]) matrix[a.id] = [];
                _.each(mmap, function (b) {
                    var recs = _.filter(data, function (row) {
                        return filter(row, a, b);
                    })
                    matrix[a.id][b.id] = accessor(recs, a, b);
                });
            });
            return matrix;
        },
        mpr.getMap = function () {
            return mmap;
        },
        mpr.printMatrix = function () {
            _.each(matrix, function (elem) {
                console.log(elem);
            })
        },
        mpr.addToMap = function (value, info) {
            if (!mmap[value]) {
                mmap[value] = { name: value, id: n++, data: info }
            }
        },
        mpr.addValuesToMap = function (varName, info) {
            var values = _.uniq(_.pluck(data, varName));
            _.map(values, function (v) {
                if (!mmap[v]) {
                    mmap[v] = { name: v, id: n++, data: info }
                }
            });
            return this;
        }
    return mpr;
}
//*******************************************************************
//  CHORD READER
//*******************************************************************
function chordRdr (matrix, mmap) {
    return function (d) {
        var i,j,s,t,g,m = {};
        if (d.source) {
            i = d.source.index; j = d.target.index;
            s = _.where(mmap, {id: i });
            t = _.where(mmap, {id: j });
            m.sname = s[0].name;
            m.sdata = d.source.value;
            m.svalue = +d.source.value;
            m.stotal = _.reduce(matrix[i], function (k, n) { return k + n }, 0);
            m.tname = t[0].name;
            m.tdata = d.target.value;
            m.tvalue = +d.target.value;
            m.ttotal = _.reduce(matrix[j], function (k, n) { return k + n }, 0);
        } else {
            g = _.where(mmap, {id: d.index });
            m.gname = g[0].name;
            m.gdata = g[0].data;
            m.gvalue = d.value;
        }
        m.mtotal = _.reduce(matrix, function (m1, n1) {
            return m1 + _.reduce(n1, function (m2, n2) { return m2 + n2}, 0);
        }, 0);
        return m;
    }
}