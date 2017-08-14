var margin = {top: 33, left: 40, right: 30, bottom: 75},
    width  = 960 - margin.left - margin.right,
    height = 500  - margin.top  - margin.bottom

var color = d3.scaleOrdinal(d3.schemeCategory20);

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var svg = d3.select("#panel1")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox","0 0 " + (width + margin.left + margin.right)  + " " + (height + margin.top + margin.bottom))
        .classed("svg-content-responsive", true)

g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(data.map(function(d) { return d.Date; }));
y.domain(
  [
  d3.min(data, function(d) { return d.ClosePrice; }), 
  d3.max(data, function(d) { return d.ClosePrice; })
  ]
  );
  
var line = d3.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.ClosePrice); });

g.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickValues(x.domain().filter(function(d, i) { return !(i % 60); })))
      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "0.2em")
        .attr("dy", ".8em")
        .attr("transform", "rotate(-65)")

g.append("g")
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y))
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("fill", "#000")
  .text("Change to backlog");
  