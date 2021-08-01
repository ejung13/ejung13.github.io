
async function load_data(country) {
	const data = await d3.csv("https://raw.githubusercontent.com/delongmeng/trackitt_I_485_data_viz/master/trackitt_d3js_final.csv", function(d) {
        // transform data
        d['month_year'] = d3.timeParse("%Y-%m")(d['month_year']);
        d['all_case_counts'] = +d['all_case_counts'];
        d['case_counts'] = +d[country + '_case_counts'];
        d['appr_perc'] = +d[country + '_appr_perc'];  
        return d;});

	draw(data, country);
}


function draw(data, country) {

    var margin = 100,
        width = 800,
        height = 400,
        shift = 10;

    // get the minimum and maximum of dates (year/month)
    var time_extent = d3.extent(data, function(d) {
        return d['month_year'];
    });

    // get the minimum and maximum of all case counts, regardless of which country category
    var count_extent = d3.extent(data, function(d) {
        return d['all_case_counts'];
    })

    // create a time scale for x-axis using d3.scaleTime()
	var xScale = d3.scaleTime().domain(time_extent).range([shift, width]);

    // create a scale for the y axis
	var yScale = d3.scaleLinear().domain([0,count_extent[1]]).range([height-shift/2, 0]);

	// set up the x-axis
	d3.select("svg")
            .attr("width", width + 2*margin)
            .attr("height", height + 2*margin)
        .append("g")
    		.attr("transform", "translate("+margin+","+(height+margin)+")")
    		.call(d3.axisBottom(xScale)
                .ticks(d3.timeMonth)
                .tickFormat(d3.timeFormat("%Y-%m")))
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-60)")

    // set up x-axis label
    d3.select("svg").append("text")
        .attr("transform", "translate("+(margin+width/2)+","+(height+margin*1.8)+")")
        .style("text-anchor", "middle")
        .attr("fill", "black")
        .text("Months");

	// set up the y axis
	d3.select("svg").append("g")
		.attr("transform", "translate("+margin+","+margin+")")
		.call(d3.axisLeft(yScale))

	// set up the y-axis label
    d3.select("svg").append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", 0-(margin + height/2))
		.attr("y", margin/2)
		.style("text-anchor", "middle")
		.text("Number of Applications Filed");  

    // create a tooltip
    var Tooltip = d3.select("div").append("div")
        .style("opacity", 0)
        .style("position", "absolute")
        .attr("class", "tooltip")
        .style("background-color", "#f9b2b2")
        .style("border", 0)
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function(d) {
        Tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("r", 8) 
            .style("fill", "#f67f7f")
      }
      var mousemove = function(d) {
        Tooltip
            .html("Case number: " + d['case_counts'] + " (Approved: " + d['appr_perc'] + "%)")
            .style("top", (parseInt(d3.select(this).attr("cy")) + 280) +"px")
            .style("left", (parseInt(d3.select(this).attr("cx")) + 50) + "px")
      }
      var mouseleave = function(d) {
        Tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("r", 5)
            .style("fill", "#a8a8a8")
      }

    // add points
    d3.select("svg").append("g")
            .attr("transform", "translate("+margin+","+margin+")")
        .selectAll().data(data).enter().append("circle")
            .attr("cx", function(d){return xScale(d['month_year']);} )
            .attr("cy", function(d){return yScale(d['case_counts']);})
            .attr("r", 5)
            .attr("fill", "#a8a8a8")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

    // Set the gradient
    d3.select("svg").append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", yScale(0))
        .attr("x2", 0)
        .attr("y2", yScale(count_extent[1]))
        .selectAll("stop")
            .data([
              {offset: "0%", color: "blue"},
              {offset: "100%", color: "red"}
            ])
        .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });

    // add the line
    d3.select("svg").append("path")
            .attr("transform", "translate("+margin+","+margin+")")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "url(#line-gradient)")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
            .x(function(d) {return xScale(d['month_year']);})
            .y(function(d) {return yScale(d['case_counts']);}))	

    d3.select("svg").append("text")
    	.attr("id", "chart_title")
        .attr("x", margin + width/2)             
        .attr("y", margin/2)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text(country == "all" ? "Applicants from All Countries"
    		: country == "India" ? "Applicants from India"
    		: country == "China" ? "Applicants from China"
    		: "Applicants from Rest of World");

}
