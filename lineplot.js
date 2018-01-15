// /Function for random numbers within a range

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Malignant Neoplasms
const MalignantNeoplasms = [
  { xValue: 2000, yValue: 1 },
  { xValue: 2005, yValue: 1.02 },
  { xValue: 2010, yValue: 1.03 },
  { xValue: 2015, yValue: 1.05 },
];

// Cardiovascular diseases
const CardioDisease = [
  { xValue: 2000, yValue: 1 },
  { xValue: 2005, yValue: 1 },
  { xValue: 2010, yValue: 1.02 },
  { xValue: 2015, yValue: 1.02 },
];

// Alzheimer disease and other dementias
const Dementias = [
  { xValue: 2000, yValue: 1 },
  { xValue: 2005, yValue: 1.22 },
  { xValue: 2010, yValue: 1.56 },
  { xValue: 2015, yValue: 1.97 },
];

// first half of data
const testDataset1 = [
  { xValue: getRandomArbitrary(1, 10), yValue: getRandomArbitrary(1, 10) },
  { xValue: getRandomArbitrary(11, 20), yValue: getRandomArbitrary(11, 20) },
  { xValue: getRandomArbitrary(21, 30), yValue: getRandomArbitrary(21, 30) },
  { xValue: getRandomArbitrary(31, 40), yValue: getRandomArbitrary(31, 40) },
  { xValue: getRandomArbitrary(41, 50), yValue: getRandomArbitrary(41, 50) },
];

// second half of data
const testDataset2 = [
  { xValue: getRandomArbitrary(51, 60), yValue: getRandomArbitrary(51, 60) },
  { xValue: getRandomArbitrary(61, 70), yValue: getRandomArbitrary(61, 70) },
  { xValue: getRandomArbitrary(71, 80), yValue: getRandomArbitrary(71, 80) },
  { xValue: getRandomArbitrary(81, 100), yValue: getRandomArbitrary(81, 90) },
  { xValue: getRandomArbitrary(81, 100), yValue: getRandomArbitrary(81, 100) },
];

// empty array to receive full data
const testDataset = [];

// pushes the two halves into the 'complete' array
Array.prototype.push.apply(testDataset, testDataset1);
Array.prototype.push.apply(testDataset, testDataset2);

// first half of 2nd data
const secondDataset1 = [
  { xValue: getRandomArbitrary(1, 10), yValue: getRandomArbitrary(1, 10) },
  { xValue: getRandomArbitrary(11, 20), yValue: getRandomArbitrary(11, 20) },
  { xValue: getRandomArbitrary(21, 30), yValue: getRandomArbitrary(21, 30) },
  { xValue: getRandomArbitrary(31, 40), yValue: getRandomArbitrary(31, 40) },
  { xValue: getRandomArbitrary(41, 50), yValue: getRandomArbitrary(41, 50) },
];

// second half of  2nd data
const secondDataset2 = [
  { xValue: getRandomArbitrary(51, 60), yValue: getRandomArbitrary(51, 60) },
  { xValue: getRandomArbitrary(61, 70), yValue: getRandomArbitrary(61, 70) },
  { xValue: getRandomArbitrary(71, 80), yValue: getRandomArbitrary(71, 80) },
  { xValue: getRandomArbitrary(81, 100), yValue: getRandomArbitrary(81, 90) },
  { xValue: getRandomArbitrary(81, 100), yValue: getRandomArbitrary(81, 100) },
];

// empty array to receive full 2nd data
const secondDataset = [];

// pushes the two halves into the 2nd 'complete' array
Array.prototype.push.apply(secondDataset, secondDataset1);
Array.prototype.push.apply(secondDataset, secondDataset2);

console.log(secondDataset);
console.log(secondDataset1);
console.log(secondDataset2);

// set viewport size
const width = 1080;
const height = 800;
const padding = 20;

// Initializing variables
let xScale,
  yScale,
  line;

// scales are made dynamically, but for the full data
xScale = d3
  .scaleLinear()
  .domain([
    d3.min(testDataset, d => d.xValue),
    d3.max(testDataset, d => d.xValue),
  ])
  .range([padding, width - padding]);

yScale = d3
  .scaleLinear()
  .domain([
    d3.min(testDataset, d => d.yValue),
    d3.max(testDataset, d => d.yValue),
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
  .datum(testDataset1)
  .attr('class', 'line')
  .attr('id', 'firstLine')
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
  .text('xTest');

svg
  .append('text')
  .attr('class', 'y label')
  .attr('text-anchor', 'end')
  .attr('y', 15)
  .attr('x', -50)
  .attr('transform', 'rotate(-90)')
  .text('yTest');

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
      d3.select('#firstLine').style('opacity', 0);

      svg
        .append('path')
        .datum(testDataset)
        .attr('class', 'line')
        .attr('id', 'secondLine')
        .style('opacity', 1)
        .attr('d', valueline);

      firstActive = false;
      secondActive = true;
    } else if (secondActive) {
      d3.select('#secondLine').style('opacity', 0.3);

      secondActive = false;
      thirdActive = true;
    } else if (thirdActive) {
      svg
        .append('path')
        .datum(secondDataset)
        .attr('class', 'line')
        .attr('id', 'thirdLine')
        .style('stroke', 'red')
        .style('opacity', 1)
        .attr('d', valueline);

      thirdActive = false;
      fourthActive = true;
    } else if (fourthActive) {
      d3.select('#secondLine').style('opacity', 1);

      fourthActive = false;
    }
  });

//    http://bl.ocks.org/d3noob/5d621a60e2d1d02086bf
