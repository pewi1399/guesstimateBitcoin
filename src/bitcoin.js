var margin = {top: 33, left: 40, right: 30, bottom: 75},
    width  = 960 - margin.left - margin.right,
    height = 650  - margin.top  - margin.bottom;

// get date
var parseTime = d3.timeParse("%Y-%m-%d");  

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}

var date = new Date();
var today = date.toISOString().substring(0, 10);
var predictDate = parseTime(today).addDays(30).toJSON().slice(0,10)

// print forecast date
$(".predictDate").html(predictDate)

var color = d3.scaleOrdinal(d3.schemeCategory20);

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().rangeRound([height, 0]);

var svg = d3.select("#panel1")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox","0 0 " + (width + margin.left + margin.right)  + " " + (height + margin.top + margin.bottom))
        .classed("svg-content-responsive", true)

g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(d3.extent(data, function(d) { return parseTime(d.Date); }));
y.domain(
  [
  0, 
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
  .attr("y", height/1.73)
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
  .call(d3.axisLeft(y).tickFormat(d => "$" + d))  
  /*.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("fill", "#000")
  .text("USD");*/
  
var path = g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("class", "liness")
    .attr("d", line)
    /*.on("mouseover", function(d){
          // alert("Year: " + d.Year + ": " + d.Celsius + " Celsius");
          d3.select("#_yr")
              .text("Month: " + Math.random());
      });
*/

var totalLength = path.node().getTotalLength();

path
  .attr("stroke-dasharray", totalLength + " " + totalLength)
  .attr("stroke-dashoffset", totalLength)
  .transition()
    .duration(3000)
    .attr("stroke-dashoffset", 0);

svg.append("g")
    .attr("class", "infowin")
    .attr("transform", "translate(70, 30)")
    .append("text")
    .attr("id", "_yr");
    
showInfo  = function(data, tabletop){
/*
  var dataNew = [{"Date":"2017-09-15","ClosePrice":4000.44},{"Date":"2017-09-15","ClosePrice":3200.2},{"Date":"2017-09-15","ClosePrice":9000.25},{"Date":"2017-09-15","ClosePrice":6000.74}
  ,{"Date":"2017-09-15","ClosePrice":3330.44},{"Date":"2017-09-15","ClosePrice":2045.2},{"Date":"2017-09-15","ClosePrice":4300.25},{"Date":"2017-09-15","ClosePrice":1000.74}]
  */
  var dataNew = data

  dataNew = JSON.parse(JSON.stringify(dataNew).split('Bitcoin rate in USD 30 days from now?').join('ClosePrice'));
  dataNew = JSON.parse(JSON.stringify(dataNew).split('Timestamp').join('Date'));
  dataNew = JSON.parse(JSON.stringify(dataNew).split('Name (optional)').join('Name'));
  
  dataNew.forEach(function(d){ d.Date = d.Date.split(' ')[0]})
  
  /*
  var xs = data.map(function(d) { return d.Date; }) 
  var xs = xs.concat("2017-09-15", "2017-10-15", "2017-10-15", "2017-09-15", "2017-09-15", "2017-09-15", "2017-09-15");
  */
  var parseTime2 = d3.timeParse("%d/%m/%Y");
  


  // update scale domains
  x.domain([
    x.domain()[0], 
    d3.max(dataNew, function(d) { return parseTime2(d.Date).addDays(35); })
    ]
    );
  
  y.domain(
    [
    0, 
    d3.max(dataNew, function(d) { return d.ClosePrice; })
    ]
    );
  
  // redraw axis  
  d3.selectAll(".axis--x")
  .transition()
  .duration(1500)
  .call(d3.axisBottom(x))//.tickValues(x.domain().filter(function(d, i) { return !(i % 10); })).tickFormat(d3.timeFormat("%Y-%m-%d")))
    .selectAll("text")  
      .style("text-anchor", "end")
      .attr("dx", "-1.20em")
      .attr("dy", ".2em")
      .attr("transform", "rotate(-65)")
        
  g.selectAll(".axis--y")
    .transition()
    .duration(1500)
    .call(d3.axisLeft(y).tickFormat(d => "$" + d)) 

  var grid = g.selectAll(".horizontalGrid").data(y.ticks(5))
  
  grid.exit().remove()
  
  grid.enter().append("line")
    .attr("class","horizontalGrid")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", function(d){ return y(d);})
    .attr("y2", function(d){ return y(d);})
    .attr("stroke","white")
    .transition()
    .duration(1500)
    .attr("stroke","lightgrey")
  
  grid
    .transition()
    .duration(1500)
    .attr("y1", function(d){ return y(d);})
    .attr("y2", function(d){ return y(d);})
  
    
  d3.select(".liness")
  .transition()
  .duration(1500)
    .attr("d", line);

  g.selectAll(".dots")
    .data(dataNew)
    .enter()
    .append("circle")
    .attr("cx", function(d){return x(parseTime2(d.Date).addDays(30))})
    .attr("cy", function(d){return y(d.ClosePrice)})
    .attr("r", 0)
    .attr("fill", "lightgrey")
    .transition()
    .delay(function(d, i){return i*250;})
    .attr("r", 4)
    .transition()
    .attr("r", 3)
    .attr("fill", "royalblue")
    
  var rate = Number($(".rate").val()),
  date = parseTime(predictDate),
  name = $(".name").val(),
  dataDot = [{"ClosePrice":rate, "Date":date, "Name":name }]

  g.selectAll(".currentDot")
    .data(dataDot)
    .enter()
    .append("circle")
    .attr("cx", function(d){return x(d.Date)})
    .attr("cy", function(d){return y(d.ClosePrice)})
    .attr("r", 0)
    .attr("fill", "orange")
    .transition()
    .delay(function(d, i){return i*250;})
    .attr("r", 4)
    .transition()
    .attr("r", 3)
    .attr("fill", "red")
       
}