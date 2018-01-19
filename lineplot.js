//  //data declaration

// Malignant Neoplasms
const MalignantNeoplasms1 = [
  { xValue: 2000, yValue: 1.0 },
  { xValue: 2005, yValue: 1.02 }
  ];

const MalignantNeoplasms2 = [
    { xValue: 2000, yValue: 1.0 },
    { xValue: 2005, yValue: 1.02 },
    { xValue: 2010, yValue: 1.03 },
];

const MalignantNeoplasms3 =[
    { xValue: 2000, yValue: 1.0 },
    { xValue: 2005, yValue: 1.02 },
    { xValue: 2010, yValue: 1.03 },
    { xValue: 2015, yValue: 1.05 }
    ];

// Cardiovascular diseases
const CardioDisease1 = [
  { xValue: 2000, yValue: 1.0 },
  { xValue: 2005, yValue: 1.0 },
  ];

const CardioDisease2 = [
    { xValue: 2000, yValue: 1.0 },
    { xValue: 2005, yValue: 1.0 },
    { xValue: 2010, yValue: 1.02 },
  ];

const CardioDisease3 = [
    { xValue: 2000, yValue: 1.0 },
    { xValue: 2005, yValue: 1.0 },
    { xValue: 2010, yValue: 1.02 },
    { xValue: 2015, yValue: 1.02 },
];

// Alzheimer disease and other dementias
const Dementias1 = [
  { xValue: 2000, yValue: 1.0 },
  { xValue: 2005, yValue: 1.22 }
  ];

const Dementias2 = [
    { xValue: 2000, yValue: 1.0 },
    { xValue: 2005, yValue: 1.22 },
    { xValue: 2010, yValue: 1.56 },
  ];

const Dementias3 = [
    { xValue: 2000, yValue: 1.0 },
    { xValue: 2005, yValue: 1.22 },
    { xValue: 2010, yValue: 1.56 },
    { xValue: 2015, yValue: 1.97 },
];

// console.log(MalignantNeoplasms1);
// console.log(CardioDisease2);
// console.log(Dementias3);

// viewport
let margin = {top: 10, right: 10, bottom: 50, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// Set the ranges
let x = d3.scaleLinear().range([0, width]);
let y = d3.scaleLinear().range([height, 0]);

// define the line
const valueline = d3.line()
    .x(function(d) { return x(d.xValue); })
    .y(function(d) { return y(d.yValue); });
    // .curve(d3.curveMonotoneX); // apply smoothing to the line, breaks animations


let svg = d3.select("body").select('#linePlot1')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


// fitting first data series
let dataset = MalignantNeoplasms1;

// Scale the range of the data in the domains
x.domain(dataset.map(function(d) { return (d.xValue); }));
y.domain([0.95, d3.max(dataset, function(d) { return (d.yValue + 0.2); })]);

// create line
// plotting the first half of the data only
svg
    .append('path')
    .datum(CardioDisease1)
    .attr('id', 'cardio1')
    .style('stroke', '#C74C63')
    .style('stroke-width', 5)
    .style('opacity', 1)
    .attr('d', valueline);

svg
    .append('path')
    .datum(MalignantNeoplasms1)
    .attr('id', 'mn1')
    .style('stroke', '#E4803F')
    .style('stroke-width', 5)
    .style('opacity', 1)
    .attr('d', valueline);

// Add the X Axis
svg.append("g")
    .attr('class', 'xaxis')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Add the Y Axis
svg.append("g")
    .attr('class', 'yaxis')
    .call(d3.axisLeft(y));

// Labelling
svg
  .append('text')
  .attr('class', 'x label')
  .attr('x', width / 2)
  .attr('y', height + 35)
  .text('Year')
  .attr("font-family", "sans-serif")
  .attr("font-size", "18px")
  .attr('text-anchor', 'end');

svg
  .append('text')
  .attr('class', 'y label')
  .attr('y', -35)
  .attr('x', height /-2)
  .text('Rate of Increase')
  .attr("font-family", "sans-serif")
  .attr("font-size", "18px")
  .attr('text-anchor', 'end')
  .attr('transform', 'rotate(-90)');

let legend = svg.selectAll(".legend")
    .data(['Cardiovascular Diseases', 'Malignant Neoplasms', 'Alzheimer\'s Disease and Other Dementias'])
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

const colour = ['#C74C63', '#E4803F', '#AC6FA0'];

// draw legend colored rectangles
legend.append("rect")
    .attr("x", width - 800)
    .attr("y", height - 600)
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", function(d, i) {return colour[i]})
    .style("stroke", "gray")
    .style("stroke-width", 0.25);

// draw legend text
legend.append("text")
    .attr("x", width - 810)
    .attr("y", height - 588)
    // .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d;});


// series of boolean tests to stage transitions
let firstActive = true;
let secondActive = false;
let thirdActive = false;
let fourthActive = false;

// on click update with new data
d3
  .select('body')
  .select('#linePlot1')
  .on('click', () => {
    // update by plotting the full data

    if (firstActive) {

        updateOne();

        firstActive = false;
        secondActive = true;

    } else if (secondActive) {

        updateTwo();

      secondActive = false;
      thirdActive = true;

    } else if (thirdActive) {

        updateThree();

        thirdActive = false;
        fourthActive = true;

    } else if (fourthActive) {

        updateFour();

    }});


function updateOne(){

    dataset = Dementias1;

    x.domain(dataset.map(function(d) { return (d.xValue); }));
    y.domain([0.95, d3.max(dataset, function(d) { return (d.yValue + 0.2); })]);

    svg.select(".xaxis") // update the x axis
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x));

    svg.select(".yaxis") // update the x axis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y));

    d3.select('#cardio1')
        .transition()
        .duration(1000)
        .attr("d", valueline(CardioDisease1))
        .style('opacity', 0.5);


    d3.select('#mn1')
        .transition()
        .duration(1000)
        .attr("d", valueline(MalignantNeoplasms1))
        .style('opacity', 0.5);

    svg.append('path')
        .datum(Dementias1)
        .attr('id', 'dementia1')
        .style('stroke', '#AC6FA0')
        .style('stroke-width', 5)
        .style('opacity', 1)
        .attr('d', valueline);

}

function updateTwo(){

    d3.select('#cardio1')
        .transition()
        .duration(750)
        .style('opacity', 1);

    d3.select('#mn1')
        .transition()
        .duration(750)
        .style('opacity', 1);

    d3.select('#dementias1')
        .transition()
        .duration(750)
        .style('opacity', 1);

}

function updateThree() {

    dataset = Dementias2;

    x.domain([2000, d3.max(dataset, function(d) { return (d.xValue); })]);
    // x.domain(dataset.map(function(d) { return (d.xValue); }));
    y.domain([0.95, d3.max(dataset, function(d) { return (d.yValue + 0.2); })]);

    d3.select('#cardio1')
        .transition()
        .duration(1000)
        .attr("d", valueline(CardioDisease2))
        .style('opacity', 1);

    d3.select('#dementia1')
        .transition()
        .duration(1000)
        .attr("d", valueline(Dementias2))
        .style('opacity', 1);


    d3.select('#mn1')
        .transition()
        .duration(1000)
        .attr("d", valueline(MalignantNeoplasms2))
        .style('opacity', 1);

    svg.select(".xaxis") // update the x axis
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x));

    svg.select(".yaxis") // update the x axis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y));

}

function updateFour() {

    dataset = Dementias3;

    x.domain([2000, d3.max(dataset, function(d) { return (d.xValue); })]);
    // x.domain(dataset.map(function(d) { return (d.xValue); }));
    y.domain([0.95, d3.max(dataset, function(d) { return (d.yValue + 0.2); })]);

    d3.select('#cardio1')
        .transition()
        .duration(1000)
        .attr("d", valueline(CardioDisease3))
        .style('opacity', 1);

    d3.select('#dementia1')
        .transition()
        .duration(1000)
        .attr("d", valueline(Dementias3))
        .style('opacity', 1);

    d3.select('#mn1')
        .transition()
        .duration(1000)
        .attr("d", valueline(MalignantNeoplasms3))
        .style('opacity', 1);

    svg.select(".xaxis") // update the x axis
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x));

    svg.select(".yaxis") // update the x axis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y));
}