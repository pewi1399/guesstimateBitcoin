var margin = {top: 33, left: 50, right: 30, bottom: 75},
    width  = 960 - margin.left - margin.right,
    height = 650  - margin.top  - margin.bottom;

var forecast_horizon = 30

// get date
var parseTime = d3.timeParse("%Y-%m-%d");  

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}

var date = new Date();
var today = date.toISOString().substring(0, 10);
var predictDate = parseTime(today).addDays(forecast_horizon + 1).toJSON().slice(0,10)

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

    
showInfo  = function(data, tabletop){
/*
  var dataNew = [{"Date":"2017-09-15","ClosePrice":4000.44},{"Date":"2017-09-15","ClosePrice":3200.2},{"Date":"2017-09-15","ClosePrice":9000.25},{"Date":"2017-09-15","ClosePrice":6000.74}
  ,{"Date":"2017-09-15","ClosePrice":3330.44},{"Date":"2017-09-15","ClosePrice":2045.2},{"Date":"2017-09-15","ClosePrice":4300.25},{"Date":"2017-09-15","ClosePrice":1000.74}]
  */
  var dataNew = data

  dataNew = JSON.parse(JSON.stringify(dataNew).split('Bitcoin rate in USD 30 days from now?').join('ClosePrice'));
  dataNew = JSON.parse(JSON.stringify(dataNew).split('Timestamp').join('Date'));
  dataNew = JSON.parse(JSON.stringify(dataNew).split('Name (optional)').join('Name'));
  
  dataNew.forEach(function(d){ 
      d.Date = d.Date.split(' ')[0]
      if(d.ClosePrice >= 40000){
        d.ClosePrice = 40000
      }
    }
    )
  
  var parseTime2 = d3.timeParse("%d/%m/%Y");

  // update scale domains
  x.domain([
    x.domain()[0], 
    d3.max(dataNew, function(d) { return parseTime2(d.Date).addDays(forecast_horizon + 5); })
    ]
    );
  
  y.domain(
    [
    0, 
    d3.max(dataNew, function(d) { return Number(d.ClosePrice); })
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
    
    // test voronoi overlay
var sites = d3.range(100)
    .map(function(d) { return [Math.random() * width, Math.random() * height]; });
    
var sites = dataNew.map(function(d){return [x(parseTime2(d.Date).addDays(forecast_horizon))+Math.random(), y(d.ClosePrice), d.Name]});

svg.append("g")
    .attr("class", "infowin")
    .attr("transform", "translate(70, 60)")
    .append("text")
    .attr("id", "nameText");

svg.append("g")
    .attr("class", "infowin")
    .attr("transform", "translate(200, 60)")
    .append("text")
    .attr("id","forecastText");


    
// copy from beeswarm block
  var cell = g.append("g")
      .attr("class", "cells")
    .selectAll("g").data(d3.voronoi()
        .extent([[0, 0], [width + margin.right, height + margin.top]])
      .polygons(sites).filter(function(d){return d;})).enter().append("g");

  cell.append("circle")
      .attr("r", 4)
      .attr("fill", "steelblue")
      .attr("cx", function(d) { return d.data[0]; })
      .attr("cy", function(d) { return d.data[1]; });
      
  cell.append("path")
    .attr("stroke", "none")
    .attr("fill", "none")
    .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

  function mouseover(d) {
    d3.select("#nameText").text("Name: " + d.data[2])
    d3.select("#forecastText").text("Forecast: " + Math.round(y.invert(d.data[1])))
    /*d3.select(d.data.city.line).classed("city--hover", true);
    d.data.city.line.parentNode.appendChild(d.data.city.line);
    focus.attr("transform", "translate(" + x(d.data.date) + "," + y(d.data.value) + ")");
    focus.select("text").text(d.data.city.name);*/
  }

  function mouseout(d) {
    d3.select("#nameText").text("")
    d3.select("#forecastText").text("")
    /*d3.select(d.data.city.line).classed("city--hover", false);
    focus.attr("transform", "translate(-100,-100)");*/
  }
// end of beeswarm
       
}

function starter(){
  setTimeout(init(), 2000)
}
// ------------------------------ mousover tooltip -----------------------------
////////////////////////////////////////////////////////////////////////////////
//--------------------------- mouseover effects --------------------------------
//-------------------------------- line ----------------------------------------
////////////////////////////////////////////////////////////////////////////////
svg.append("g")
    .attr("class", "infowin")
    .attr("transform", "translate(70, 40)")
    .append("text")
    .attr("id", "dateText");

svg.append("g")
    .attr("class", "infowin")
    .attr("transform", "translate(200, 40)")
    .append("text")
    .attr("id","rateText"); 

// Define the div for the tooltip
var div2 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add a placeholder for the effects (PW)
var mouseG = svg
  .on('mouseout', function() { // on mouse out hide line, circles and text
   // d3.select(".mouse-line")
   //   .style("opacity", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "0");
  })
  .on('mousemove', function() { // mouse moving over canvas
      d3.selectAll(".mouse-per-line circle")
      .style("opacity", "1");
  
    var mouse = d3.mouse(this);
    d3.select(".mouse-line")
      .attr("d", function() {
        var d = "M" + mouse[0]+ "," + height;
        d += " " + mouse[0] + "," + 0;
        return d;
      });

// *** of secondary importance ***
  // variable lines contain the actual lines (PW)
  var lines = document.getElementsByClassName('liness');

  // create g element for every line ()
  var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(d3.selectAll(".liness").data())
    .enter()
    .append("g")
    .attr("class", "mouse-per-line")
		.attr("name", "mousetip")
		/*.on("mouseover", function(d) {

		div.transition()
				.duration(200)
				.style("opacity", 0.9);
		div	.html("row one" + "<br/>"  + "row two")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY) + "px");
		})
		.on("mouseout", function(d) {
		div.transition()
				.duration(500)
				.style("opacity", 0);
		});*/

  // append circles for mouseover
  mousePerLine.append("circle")
    .attr("r", 7)
    .attr("stroke", "steelblue")
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");

// function for intersection markers
        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            //for each datapoint get the y value for the corresponding x value of
            // the cursor stored in first position of array "mouse"
            d = d.map(function(d){return parseTime(d.Date);})
            
            // adjust mouse coords
            mouse[0] = mouse[0] - margin.left
            
            var xDate = x.invert(mouse[0]), // the current value on the x scale to look for
                bisect = d3.bisector(function(d) { return d; }).right; //
                idx = bisect(d, xDate); //
              if(idx >0 & idx < d.length){

            var beginning = 0, //start searching at zero
                end = lines[i].getTotalLength(), // entire length of line defines area of search
                target = null; // this we would like to find out

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
              d3.select("#rateText").text("Price: " + Math.round(y.invert(pos.y)))//"Price: " + Math.Round(y.invert(pos.y)))
              d3.select("#dateText").text("Date: " + x.invert(mouse[0]).toJSON().split('T')[0])
            return "translate(" + (mouse[0]+margin.left) + "," + (pos.y +margin.top) +")";
              }
            
          });
});