// /Function for random numbers within a range

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Malignant Neoplasms
const MalignantNeoplasms1 = [
  { xValue: 2000, yValue: 1.0 },
  { xValue: 2005, yValue: 1.02 }
  ];


const MalignantNeoplasms2 =[
    { xValue: 2010, yValue: 1.03 },
    { xValue: 2015, yValue: 1.05 }
    ];

const MalignantNeoplasmsAll = [];

// pushes the two halves into the 'complete' array
Array.prototype.push.apply(MalignantNeoplasmsAll, MalignantNeoplasms1);
Array.prototype.push.apply(MalignantNeoplasmsAll, MalignantNeoplasms2);

// Cardiovascular diseases
const CardioDisease1 = [
  { xValue: 2000, yValue: 1.0 },
  { xValue: 2005, yValue: 1.0 }
  ];

const CardioDisease2 = [
    { xValue: 2010, yValue: 1.02 },
    { xValue: 2015, yValue: 1.02 }
  ];

const CardioDiseaseAll = [];

// pushes the two halves into the 'complete' array
Array.prototype.push.apply(CardioDiseaseAll, CardioDisease1);
Array.prototype.push.apply(CardioDiseaseAll, CardioDisease2);

// Alzheimer disease and other dementias
const Dementias1 = [
  { xValue: 2000, yValue: 1.0 },
  { xValue: 2005, yValue: 1.22 }
  ];

const Dementias2 = [
  { xValue: 2010, yValue: 1.56 },
  { xValue: 2015, yValue: 1.97 }
  ];

const DementiasAll = [];

// pushes the two halves into the 'complete' array
Array.prototype.push.apply(DementiasAll, Dementias1);
Array.prototype.push.apply(DementiasAll, Dementias2);

console.log(MalignantNeoplasmsAll);
console.log(CardioDiseaseAll);
console.log(DementiasAll);

// set viewport size
const width = 1080;
const height = 800;
const padding = 40;

// Initializing variables
let xScale,
  yScale,
  line;

// scales are made dynamically, but for the full data
xScale = d3
  .scaleLinear()
  .domain([
    d3.min(DementiasAll, d => d.xValue),
    d3.max(DementiasAll, d => d.xValue),
  ])
  .range([padding, width]);

yScale = d3
  .scaleLinear()
  .domain([
    d3.min(DementiasAll, d => d.yValue),
    d3.max(DementiasAll, d => d.yValue),
  ])
  .range([height - padding, padding]);

// define the line
const valueline = d3
  .line()
  .x(d => xScale(d.xValue))
  .y(d => yScale(d.yValue))
  .curve(d3.curveMonotoneX); // apply smoothing to the line;

const svg = d3
  .select('body')
  .select('#linePlot1')
  .attr('width', width)
  .attr('height', height);

// create line
// plotting the first half of the data only
svg
  .append('path')
  .datum(CardioDisease1)
  .attr('class', 'line')
  .attr('id', 'cardio1')
  .style('stroke', '#C74C63')
  .style('opacity', 1)
  .attr('d', valueline);

svg
    .append('path')
    .datum(MalignantNeoplasms1)
    .attr('class', 'line')
    .attr('id', 'mn1')
    .style('stroke', '#E4803F')
    .style('opacity', 1)
    .attr('d', valueline);



// Define Axes
xAxis = d3.axisBottom().scale(xScale);

yAxis = d3.axisLeft().scale(yScale);

// create Axes
svg
  .append('g')
  .attr('class', 'axis')
  .attr('transform', `translate(0,${height - padding})`)
  .call(xAxis);

svg
  .append('g')
  .attr('class', 'axis')
  .attr('transform', `translate(${padding},0)`)
  .call(yAxis);

// Labelling
svg
  .append('text')
  .attr('class', 'x label')
  .attr('text-anchor', 'end')
  .attr('x', width - 50)
  .attr('y', height - 10)
  .text('Year');

svg
  .append('text')
  .attr('class', 'y label')
  .attr('text-anchor', 'end')
  .attr('y', 15)
  .attr('x', -50)
  .attr('transform', 'rotate(-90)')
  .text('Rate');

let legend = svg.selectAll(".legend")
    .data(['Cardiovascular Diseases', 'Malignant Neoplasms', 'Alzheimer\'s Disease and Other Dementias'])
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

const colour = ['#C74C63', '#E4803F', '#AC6FA0'];

// draw legend colored rectangles
legend.append("rect")
    .attr("x", width - 15)
    .attr("y", height - 500)
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", function(d, i) {return colour[i]})
    .style("stroke", "gray")
    .style("stroke-width", 0.25);

// draw legend text
legend.append("text")
    .attr("x", width - 24)
    .attr("y", height - 491)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d;});


//series of boolean tests to stage transitions

let firstActive = true;
let secondActive = false;
let thirdActive = false;

// on click update with new data
d3
  .select('body')
  .select('#linePlot1')
  .on('click', () => {
    // update by plotting the full data

    if (firstActive) {
      d3.select('#cardio1').style('opacity', 0.5);
      d3.select('#mn1').style('opacity', 0.5);

      d3.select('#lineplot1').transition();

      svg
        .append('path')
        .datum(Dementias1)
        .attr('class', 'line')
        .attr('id', 'dementias1')
        .style('stroke', '#AC6FA0')
        .style('opacity', 1)
        .attr('d', valueline);

      firstActive = false;
      secondActive = true;
    } else if (secondActive) {
        d3.select('#cardio1').style('opacity', 0);
        d3.select('#mn1').style('opacity', 0);
        d3.select('#dementias1').style('opacity', 0);

        svg
            .append('path')
            .datum(CardioDiseaseAll)
            .attr('class', 'line')
            .attr('id', 'cardio2')
            .style('stroke', '#C74C63')
            .style('opacity', 1)
            .attr('d', valueline);

        svg
            .append('path')
            .datum(MalignantNeoplasmsAll)
            .attr('class', 'line')
            .attr('id', 'mn2')
            .style('stroke', '#E4803F')
            .style('opacity', 1)
            .attr('d', valueline);

        svg
            .append('path')
            .datum(DementiasAll)
            .attr('class', 'line')
            .attr('id', 'dementia2')
            .style('stroke', '#AC6FA0')
            .style('opacity', 1)
            .attr('d', valueline);

      secondActive = false;
      thirdActive = true;
    } else if (thirdActive) {
        d3.select('#cardio2').style('opacity', 1);
        d3.select('#mn2').style('opacity', 1);
        d3.select('#dementias2').style('opacity', 1);

    }
  });

// enter() update() instead of rehashing?, to allow same effect with transitions?
// http://bl.ocks.org/d3noob/7030f35b72de721622b8



// https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
// http://bl.ocks.org/phoebebright/3061203
// http://bl.ocks.org/WilliamQLiu/0aab9d28ab1905ac2c8d
// http://bl.ocks.org/d3noob/7030f35b72de721622b8