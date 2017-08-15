var margin = {top: 33, left: 40, right: 30, bottom: 75},
    width  = 960 - margin.left - margin.right,
    height = 500  - margin.top  - margin.bottom

var color = d3.scaleOrdinal(d3.schemeCategory20);

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().rangeRound([height, 0]);

var parseTime = d3.timeParse("%Y-%m-%d");

var svg = d3.select("#panel1")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox","0 0 " + (width + margin.left + margin.right)  + " " + (height + margin.top + margin.bottom))
        .classed("svg-content-responsive", true)

g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(d3.extent(data, function(d) { return parseTime(d.Date); }));
y.domain(
  [
  d3.min(data, function(d) { return d.ClosePrice; }), 
  d3.max(data, function(d) { return d.ClosePrice; })
  ]
  );
  
var line = d3.line()
    .x(function(d) { return x(parseTime(d.Date)); })
    .y(function(d) { return y(d.ClosePrice); });
    
    
// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(3)
}

g.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))//.tickFormat(d3.timeFormat("%Y-%m-%d")))//.tickValues(x.domain().filter(function(d, i) { return !(i % 1); })).tickFormat(d3.timeFormat("%Y-%m-%d")))
      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-1.20em")
        .attr("dy", ".2em")
        .attr("transform", "rotate(-65)")
        
// add the Y gridlines
/*g.append("g")			
    .attr("class", "grid")
    .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
    )
*/
// add bitcoin watermark
g.selectAll(".watermark")
  .data([1])
  .enter()
  .append("text")
  .attr('font-family', 'FontAwesome')
  .attr("y", height/1.65)
  .attr("x", width/2.5)
  .attr("font-size", "160")
  .attr("fill", "whitesmoke")
  .text(function(d) { return '\uf15a' }); 

g.selectAll(".horizontalGrid").data(y.ticks(5)).enter()
    .append("line")
    .attr("class","horizontalGrid")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", function(d){ return y(d);})
    .attr("y2", function(d){ return y(d);})
    .attr("stroke","lightgrey")

g.append("g")
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y))  
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("fill", "#000")
  .text("USD");
  
g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("class", "liness")
    .attr("d", line)
    .on("mouseover", function(d){
          // alert("Year: " + d.Year + ": " + d.Celsius + " Celsius");
          d3.select("#_yr")
              .text("Month: " + Math.random());
      });

svg.append("g")
    .attr("class", "infowin")
    .attr("transform", "translate(70, 30)")
    .append("text")
    .attr("id", "_yr");
    
redraw = function(){

  var dataNew = [{"Date":"2017-09-15","ClosePrice":4000.44},{"Date":"2017-09-15","ClosePrice":3200.2},{"Date":"2017-09-15","ClosePrice":9000.25},{"Date":"2017-09-15","ClosePrice":6000.74}
  ,{"Date":"2017-09-15","ClosePrice":3330.44},{"Date":"2017-09-15","ClosePrice":2045.2},{"Date":"2017-09-15","ClosePrice":4300.25},{"Date":"2017-09-15","ClosePrice":1000.74}]
  
  var xs = data.map(function(d) { return d.Date; }) 
 
  var xs = xs.concat("2017-09-15", "2017-10-15", "2017-10-15", "2017-09-15", "2017-09-15", "2017-09-15", "2017-09-15");
 
  var xs = xs.map(function(d) { return parseTime(d); }) 
 
  // update scale domains
  x.domain(d3.extent(xs));
  y.domain(
    [
    d3.min(data, function(d) { return d.ClosePrice; }), 
    d3.max(dataNew, function(d) { return d.ClosePrice; })
    ]
    );
  
  // redraw axis  
  d3.selectAll(".axis--x")
  .transition()
  .call(d3.axisBottom(x))//.tickValues(x.domain().filter(function(d, i) { return !(i % 10); })).tickFormat(d3.timeFormat("%Y-%m-%d")))
    .selectAll("text")  
      .style("text-anchor", "end")
      .attr("dx", "-1.20em")
      .attr("dy", ".2em")
      .attr("transform", "rotate(-65)")
        
  g.selectAll(".axis--y")
    .transition()
    .call(d3.axisLeft(y))

  g.selectAll(".horizontalGrid").remove()

  g.selectAll(".horizontalGrid").data(y.ticks(5)).enter()
    .append("line")
    .attr("class","horizontalGrid")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", function(d){ return y(d);})
    .attr("y2", function(d){ return y(d);})
    .attr("stroke","lightgrey")
    
  d3.select(".liness")
  .transition()
    .attr("d", line);

  g.selectAll(".dots")
    .data(dataNew)
    .enter()
    .append("circle")
    .attr("cx", function(d){return x(parseTime(d.Date))})
    .attr("cy", function(d){return y(d.ClosePrice)})
    .attr("r", 0)
    .attr("fill", "lightgrey")
    .transition()
    .delay(function(d, i){return i*1500;})
    .attr("r", 4)
    .transition()
    .attr("r", 3)
    .attr("fill", "royalblue")
       
}