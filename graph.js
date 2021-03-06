async function readcsv(year) {
	const data = await d3.csv("https://raw.githubusercontent.com/ejung13/ejung13.github.io/main/suicide_" + year + ".csv", function(d) {
        // transform data
        d['gdp_per_capita'] = parseInt(d['gdp_per_capita']);
	d['suicides_100k_pop'] = parseFloat(d['suicides_100k_pop']);

        return d;});
	creategraph(data, year);
}

function creategraph(data, year) {
	
	var margin = 80,
        width = 600,
        height = 400,
        shift = 10;

    // Get the extent of GDP 
    var gdp_extent = d3.extent(data, function(d) {
        return d['gdp_per_capita'];
    });
	
    // Get the extent of Suicide Numbers
    var suicide_extent = d3.extent(data, function(d) {
        return d['suicides_100k_pop'];
    });	
	
    // Set X Scale
	var xScale = d3.scaleLinear().domain(gdp_extent).range([0, width]);

    // Set Y Scale
	var yScale = d3.scaleLinear().domain(suicide_extent).range([height, 0]);

    	var Color = d3.scaleLinear().domain(gdp_extent).range(["#008000", "#FFDD73"]);

	
	// Add X axis
	d3.select("svg").append("g")
		.attr("width", width + 2*margin)
		.attr("transform", "translate("+margin+","+(height+margin)+")")		
		.call(d3.axisBottom(xScale))

	// X axis label
	d3.select("svg").append("text")
		.attr("transform", "translate("+(margin+width/2)+","+(height+margin*1.5)+")")
		.style("text-anchor", "middle")
		.attr("fill", "black")
		.text("GDP per Capita");

	// Add Y axis
	d3.select("svg").append("g")
		.attr("height", height + 2*margin)
		.attr("transform", "translate("+margin+","+margin+")")
		.call(d3.axisLeft(yScale));

	// Y axis label
    d3.select("svg").append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", 0-(margin + height/2))
		.attr("y", margin/2)
		.style("text-anchor", "middle")
		.text("Suicides per 100K population");  

    // Create a tooltip
    var Tooltip = d3.select("div").append("div")
        .style("opacity", 1)
        .style("position", "absolute")
        .attr("class", "tooltip")
        .style("background-color", "#FFB2D9")
        .style("border", 0)
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("color", "white")

      //   // -2- Create 3 functions to show / move / hide the tooltip
      var showTooltip = function(d) {
        Tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("r", 8) 
            .style("fill", "#FFB2D9")
      }
      var moveTooltip = function(d) {
        Tooltip
            .html("Country: " + d['country'])
            .style("top", (parseInt(d3.select(this).attr("cy")) + 250) +"px")
            .style("left", (parseInt(d3.select(this).attr("cx")) + 50) + "px")
      }
      var hideTooltip = function(d) {
        Tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("r", 5)
            .style("fill", function(d) {return Color(d['gdp_per_capita']);} )  
      }

    // add points
    d3.select("svg").append("g")
            .attr("transform", "translate("+margin+","+margin+")")
        .selectAll("dot").data(data).enter().append("circle")
            .attr("cx", function(d) {return xScale(d['gdp_per_capita']);} )
            .attr("cy", function(d) {return yScale(d['suicides_100k_pop']);} )
            .attr("r", 5)
            .style("fill", function(d) {return Color(d['gdp_per_capita']);} )  
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)
}
