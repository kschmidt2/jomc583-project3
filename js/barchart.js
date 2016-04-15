// margins
var margin = {top: 20, right: 70, bottom: 30, left: 100},
    width = 890 - margin.left - margin.right,
    height = 380 - margin.top - margin.bottom;

// set up scales
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

// chart colors
var color = d3.scale.ordinal()
    .range(["dark", "light"]);

// set up axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxisLeft = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var yAxisRight = d3.svg.axis()
    .scale(y)
    .orient("right")
    .ticks(5)
    .tickFormat(d3.format(".2s"));

// Define the line

var valueline = d3.svg.line()
    .x(function(d) { return x(d.season) +17; })
    .y(function(d) { return y(d.velocity);})
    .defined(function(d) { return !isNaN(d.velocity); });


// set up svg
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + (margin.left-60) + "," + margin.top + ")")
    .attr("id", "bar-chart");

var svg2 = d3.select("svg")
  .append("g")
    .attr("transform", "translate(" + (margin.left-60) + "," + margin.top + ")")
    .attr("id", "line-chart");



// load data
d3.json('js/data.json', function(err, data) {
  dataset = data;
  //console.log(err);
  //console.log(data);


    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "season" && key !== "velocity";}));

      data.forEach(function(d) {
        var y0 = 0;
        d.total = d.swinging + d.looking;
        d.types = color.domain().map(function(type) { return {season: d.season, looking: d.looking, swinging: d.swinging, total: d.total, type: type, y0: y0, y1: y0 += +d[type]}; });
        d.season = +d.season;
        d.velocity = +d.velocity;
        // console.log(d.velocity);
      });

      // console.log(data);

      var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            // console.log(d);
            return "<h2>" + d.season + "</h2><strong>Strikeouts looking:</strong> " + d.looking.toLocaleString() + "<br/><strong>Strikeouts swinging:</strong> " + d.swinging.toLocaleString() + "<br/><strong>Total strikeouts:</strong> " + d.total.toLocaleString();
          })

      svg.call(tip);

      // data.sort(function(a, b) { return b.total - a.total; });

      x.domain(data.map(function(d) { return d.season; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxisLeft)
          .style("fill", "#60968e")
          .style("font-weight", 700)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 4)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .style("font-size", 9)
          .style("font-weight", 700)
          .style("text-transform", "uppercase")
          .style("fill", "#60968e")
          .text("Strikeouts");

      var year = svg.selectAll(".year")
          .data(data)
        .enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) { return "translate(" + x(d.season) + ",0)"; });

      year.selectAll("rect")
          .data(function(d) { return d.types; })
        .enter().append("rect")
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.y1); })
          .attr("height", function(d) { return y(d.y0) - y(d.y1); })
          .attr("class", function(d) { return color(d.type); })
          // .attr("class", "bar-hover")
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)

      var legend = svg.selectAll(".legend")
          .data(color.domain().slice().reverse())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(-670," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .attr("class", color);

      legend.append("text")
          .attr("x", width + 6)
          .attr("y", 9)
          .attr("dy", ".35em")
          .text(function(d) { return d; });

      // line chart

      y.domain([88, 93]);

      var tipLine = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            // console.log(d);
            return "<strong>Average fastball velocity:</strong> " + d.velocity + "mph";
          })

      svg2.call(tipLine);

      svg2.append("path")
          .attr("class", "line")
          .attr("d", valueline(data));

            // console.log(d.season);
            // console.log(d.velocity);

      svg2.selectAll("dot")
            .data(data.filter(function(d) { return !isNaN(d.velocity); }))
        .enter().append("circle")
            .attr("r", 5)
            .attr("cx", valueline.x())
            .attr("cy", valueline.y())
            .on('mouseover', tipLine.show)
            .on('mouseout', tipLine.hide);


        // Add the Y Axis
        svg2.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + width + " ,0)")
            .call(yAxisRight)
            .style("fill", "#dc5357")
            .style("font-weight", 700)
          .append("text")
            .attr("transform", "rotate(90)")
            .attr("y", 4)
            .attr("dy", ".71em")
            .style("font-size", 9)
            .style("font-weight", 700)
            .style("text-transform", "uppercase")
            .style("fill", "#dc5357")
            .text("Velocity (mph)");
});




//
// var xScale = d3.scale.ordinal()
//       .domain(d3.range(0, chartdata.length))
//       .rangeBands([0, width])
//
// var yScale = d3.scale.linear()
//       .domain([0, 30000])
//       .range([0, height])
//
// d3.select('#chart').append('svg')
//     .attr('width', width + '%')
//     .attr('height', height)
//     .style('border', '1px solid black')
//     .append('g')
//     .selectAll('rect').data(chartdata)
//     .enter().append('rect')
//         .style('fill', 'red')
//         .attr('width', xScale.rangeBand() - barOffset)
//         .attr('height', function(d){
//           return yScale(d);
//         })
//         .attr('x', function(d,i){
//           // return i * (barWidth + barOffset);
//           return xScale(i);
//         })
//         .attr('y', function(d){
//           return height - yScale(d);
//         })
