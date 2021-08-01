// set the dimensions and margins of the graph
var margin = {top: 40, right: 150, bottom: 60, left: 30};
var width = 460 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;


var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleLinear().rangeRound([height, 0]);

var yaxis = d3.axisLeft().scale(yScale);
var xaxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));

// gridlines in x/y axis function

function make_x_gridlines() {
    return d3.axisBottom(xScale)
    .ticks(5)
}

function make_y_gridlines() {
    return d3.axisLeft(yScale)
    .ticks(5)
}


// append the svg object to the body of the page
var svg = d3.select("#scatter_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/ejung13/ejung13.github.io/main/suicide_2000.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 55000])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-1, 50])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
    
    
  // Add X grid lines
  svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
        .tickSize(-height)
        .tickFormat("")
      );
    
  // Add Y grid lines
  svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
      );

  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width)
      .attr("y", height+50 )
      .text("Gdp per Capita");

  // Add Y axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", -20 )
    .text("Suicide per 100K population")
    .attr("text-anchor", "start");

  // Color scale
  var color = d3.scaleLinear()
    .domain([500, 25000, 55000])
    .range([ "green", "gold"]);

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.gdp_per_capita); } )
      .attr("cy", function (d) { return y(d.suicides_100k_pop); } )
      .attr("r", 5)
      .style("fill", function (d) { return color(d.gdp_per_capita) } )
      // -3- Trigger the functions for hover
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip );

})
