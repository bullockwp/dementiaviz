const grey = '#666';
const red = '#c9252c';
const pink = '#da3e7b';
const orange = '#f15a22';
const green = '#00a05b';
const blue = '#0071ae';
const purple = '#6A5D93';
const yellow = '#f2be1a';

const popup = d3
  .select('#popup')
  .append('div')
  .attr('class', 'popupContent')
  .classed('hidden', true);

function showPopup(x, y, text) {
  if (text) {
    popup.html(text);
  }
  popup.style('left', `${x + 16}px`);
  popup.style('top', `${y - 16}px`);
  popup.classed('hidden', false);
}

function hidePopup() {
  popup.classed('hidden', true);
}

// Function for converting CSV values from strings to integers
function rowConverter(d) {
  return {
    area: d.area,
    code: d.code,
    // year: new Date(+d.year),
    year: parseInt(d.year, 10),
    total: parseInt(d.total, 10),
    '0-14': parseInt(d['0-14'], 10),
    '15-64': parseInt(d['15-64'], 10),
    '65+': parseInt(d['65+'], 10),
  };
}

function getEstimates(yearsData, ageGroups, year) {
  const yearData = _.find(yearsData, { year }); // _.find ~= _.filter but returns only the first found
  const data = _.pick(yearData, ageGroups);
  const estimates = Object.entries(data).map(([age, estimate]) => ({
    age,
    estimate,
  }));
  return estimates;
}
function round(value, decimals) {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
}

const svg = d3
  .select('#plot-area')
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100%');

function drawBarPlot(data, transition = false) {
  const w = parseInt(svg.style('width'), 10);
  const h = parseInt(svg.style('height'), 10);
  const padding = 40;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(window.estimates2030, d => d.estimate)])
    // .domain([0, 7000000])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleBand()
    .domain(d3.range(3))
    .rangeRound([h / 4 * 3 - padding, h / 4 + padding])
    .paddingInner(0.05);

  g = svg.append('g').attr('class', 'bar-plot');

  const bars = svg
    .select('g.bar-plot')
    .selectAll('rect')
    .data(data);

  if (transition) {
    bars
      .transition()
      .duration(1000)
      .attr('data-age', d => d.age)
      .attr('x', padding)
      .attr('y', (d, i) => yScale(i))
      .attr('width', d => xScale(d.estimate))
      .attr('height', yScale.bandwidth())
      .attr('fill', purple)
      .attr('opacity', (d, i) => 0.33 * (i + 1));

    g
      .select('.x-axis') // update the x axis
      .transition()
      .duration(1000)
      .call(d3.axisBottom(xScale).ticks(5));
  } else {
    bars
      .enter()
      .append('rect')
      .attr('data-age', d => d.age)
      .attr('x', padding)
      .attr('y', (d, i) => yScale(i))
      .attr('width', d => xScale(d.estimate))
      .attr('height', yScale.bandwidth())
      .attr('fill', purple)
      .attr('opacity', (d, i) => 0.33 * (i + 1))
      .on('mouseover', (d) => {
        const ev = d3.event;
        const popupText = `Age group: ${d.age} <br/> Number: ${d.estimate}`;
        showPopup(ev.pageX, ev.pageY, popupText);
      })
      .on('mouseout', (d) => {
        hidePopup();
      });

    // Add the X Axis
    g
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${h / 4 * 3 + 10})`)
      .call(d3.axisBottom(xScale).ticks(5));
  }
}

function drawPieChart(data) {
  const totalPopNumber = _.sumBy(data, 'estimate');

  const w = parseInt(svg.style('width'), 10);
  const h = parseInt(svg.style('height'), 10);
  const padding = 40;

  const outerRadius = Math.min(w, h) / 2;
  const innerRadius = 0;
  const arc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius - padding);

  const pie = d3
    .pie()
    .sort(null)
    .value(d => d.estimate);

  // Create SVG element
  svg
    .append('g')
    .attr('class', 'pie-chart')
    .attr('transform', `translate(${outerRadius},${h / 2})`);

  // Set up groups
  const arcs = svg
    .select('g.pie-chart')
    .selectAll('g.arc')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('class', 'arc')
    .attr('fill', purple)
    .attr('opacity', (d, i) => 0.33 * (i + 1))
    .attr('d', arc)
    .each((d) => {
      this._current = d;
    })
    .on('mouseover', (d) => {
      const ev = d3.event;
      const popupText = `Age group: ${d.data.age} <br/> Number: ${
        d.data.estimate
      } <br/> Percentage: ${round(d.data.estimate / totalPopNumber * 100, 1)}%`;
      showPopup(ev.pageX, ev.pageY, popupText);
    })
    .on('mouseout', (d) => {
      hidePopup();
    });

  // Labels
  arcs
    .append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .text(d => d.data.estimate / totalPopNumber * 100);

  window.arc = arc;
  window.pie = pie;
  window.arcs = arcs;

  return [arc, pie, arcs];
}

// This block of code modified from https://bl.ocks.org/mbostock/1346410
// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  const i = d3.interpolate(this._current, a);
  this._current = i(0);
  return t => arc(i(t));
}

function arcTransition(data) {
  const totalPopNumber = _.sumBy(data, 'estimate');

  arcs
    .data(pie(data))
    .transition()
    .duration(1000)
    .attrTween('d', arcTween);
}

d3
  .queue()
  .defer(
    d3.csv,
    'https://na399.github.io/dementiaviz/data/csv/population-estimates.csv',
    rowConverter,
  )
  // .defer(d3.csv, 'dataByDistrict.csv')
  .await((error, populationEstimates) => {
    if (error) throw error;

    const yearList = [2015, 2030];
    const ageGroups = ['0-14', '15-64', '65+'];

    const selectedYears = _.filter(
      populationEstimates,
      o => o.area === 'WORLD' && yearList.indexOf(o.year) > -1, // return only years in the list
    );

    window.estimates2015 = getEstimates(selectedYears, ageGroups, 2015);
    window.estimates2030 = getEstimates(selectedYears, ageGroups, 2030);

    // drawBarPlot(estimates2015);

    // let numClicks = 0;

    // d3.selectAll('rect').on('click', () => {
    //   if (numClicks % 2 === 0) {
    //     drawBarPlot(estimates2030, (transition = true));
    //   } else {
    //     drawBarPlot(estimates2015, (transition = true));
    //   }
    //   numClicks += 1;
    // });

    // returns = drawPieChart(estimates2015);
    // arc = returns[0];
    // pie = returns[1];
    // arcs = returns[2];

    // let numClicksPie = 0;

    // arcTransition(arc, pie, arcs, estimates2015);

    // d3.selectAll('path.arc').on('click', () => {
    //   console.log('clicked');
    //   if (numClicksPie % 2 === 0) {
    //     arcTransition(arc, pie, arcs, estimates2030);
    //   } else {
    //     arcTransition(arc, pie, arcs, estimates2015);
    //   }
    //   numClicksPie += 1;
    // });
  });

initWaypoints();

function clearSVG() {
  d3
    .select('#plot-area')
    .select('svg')
    .selectAll('*')
    .remove();
}

function addText(text) {
  svg
    .selectAll('text')
    .data(text)
    .enter()
    .append('text')
    .text(d => d)
    .attr('transform', 'translate(400,300)');
}

function addImg(img) {
  d3
    .select('#plot-area')
    .select('svg')
    .selectAll('image')
    .data(img)
    .enter()
    .append('image')
    .attr('xlink:href', img)
    .attr('x', '20%')
    .attr('y', '20%')
    .attr('width', '60%')
    .attr('height', '60%');
}

let newPatient = 0;
let t;

function counter() {
  newPatient += 1;
  setTimeout(counter, 3000);
}

counter();

function addCounter() {
  if (window.counterIsInView) {
    const svg = d3.select('#plot-area').select('svg');

    const w = parseInt(svg.style('width'), 10);
    const h = parseInt(svg.style('height'), 10);

    svg.selectAll('*').remove();

    svg
      .append('g')
      .attr('transform', `translate(${w / 2},${h / 2})`)
      .html(`<text style="font-size: 120px; text-align: center; fill: ${purple}">${newPatient}</text>`);

    setTimeout(addCounter, 1000);
  }
}

// Waypoints
function initWaypoints() {
  const cover = new Waypoint({
    element: document.getElementById('cover'),
    handler() {
      clearSVG();
      // d3.select('.bar-plot').classed('hidden', true);
      // const text = ['[cover picture]'];
      // addText(text);
    },
    offset: '-1%',
  });

  const quote1 = new Waypoint({
    element: document.getElementById('quote1'),
    handler() {
      clearSVG();
      const img = ['img/dr-chan-circle.jpg'];
      addImg(img);
    },
    offset: '20%',
  });

  const quote2 = new Waypoint({
    element: document.getElementById('quote2'),
    handler() {
      clearSVG();
      const img = ['img/dr-butler-circle.jpg'];
      addImg(img);
    },
    offset: '20%',
  });

  const populationBar1 = new Waypoint({
    element: document.getElementById('population-bar1'),
    handler(direction) {
      if (direction === 'down') {
        clearSVG();
        drawBarPlot(estimates2015, (transition = false));
      } else {
        drawBarPlot(estimates2015, (transition = true));
      }
    },
    offset: '20%',
  });

  const populationBar2 = new Waypoint({
    element: document.getElementById('population-bar2'),
    handler(direction) {
      if (direction === 'down') {
        drawBarPlot(estimates2030, (transition = true));
      } else {
        clearSVG();
        drawBarPlot(estimates2030, (transition = false));
      }
    },
    offset: '20%',
  });

  const populationPie1 = new Waypoint({
    element: document.getElementById('population-pie1'),
    handler(direction) {
      if (direction === 'down') {
        clearSVG();
        drawPieChart(estimates2015);
        arcTransition(estimates2015);
      } else {
        arcTransition(estimates2015);
      }
    },
    offset: '20%',
  });

  const populationPie2 = new Waypoint({
    element: document.getElementById('population-pie2'),
    handler(direction) {
      if (direction === 'down') {
        arcTransition(estimates2030);
      } else {
        clearSVG();
        drawPieChart(estimates2030);
        arcTransition(estimates2030);
      }
    },
    offset: '20%',
  });

  const diseaseBar1 = new Waypoint({
    element: document.getElementById('disease-bar1'),
    handler() {
      clearSVG();
      diseasePlot.drawDiseasePlot();
    },
    offset: '20%',
  });

  const diseaseBar2 = new Waypoint({
    element: document.getElementById('disease-bar2'),
    handler() {
      diseasePlot.updateData2005();
    },
    offset: '20%',
  });

  const diseaseBar3 = new Waypoint({
    element: document.getElementById('disease-bar3'),
    handler() {
      diseasePlot.updateData2010();
    },
    offset: '20%',
  });

  const diseaseBar4 = new Waypoint({
    element: document.getElementById('disease-bar4'),
    handler(direction) {
      if (direction === 'down') {
        diseasePlot.updateData2015();
      } else {
        clearSVG();
        diseasePlot.drawDiseasePlot();
        diseasePlot.updateData2015();
      }
    },
    offset: '20%',
  });

  const rateLine1 = new Waypoint({
    element: document.getElementById('rate-line1'),
    handler(direction) {
      if (direction === 'down') {
        clearSVG();
        diseasePlot.drawRatePlot();
      }
    },
    offset: '20%',
  });

  let isUpdatedOne = false;

  const rateLine2 = new Waypoint({
    element: document.getElementById('rate-line2'),
    handler(direction) {
      if (direction === 'down' && !isUpdatedOne) {
        diseasePlot.updateOne();
        isUpdatedOne = true;
      }
    },
    offset: '20%',
  });

  const rateLine4 = new Waypoint({
    element: document.getElementById('rate-line4'),
    handler(direction) {
      if (direction === 'down') {
        diseasePlot.updateThree();
      }
    },
    offset: '20%',
  });

  const rateLine5 = new Waypoint({
    element: document.getElementById('rate-line5'),
    handler(direction) {
      if (direction === 'down') {
        diseasePlot.updateFour();
      } else {
        window.counterIsInView = false;
        clearSVG();
        diseasePlot.drawRatePlot();
        diseasePlot.updateOne();
        diseasePlot.updateThree();
        diseasePlot.updateFour();
      }
    },
    offset: '20%',
  });

  const counter = new Waypoint({
    element: document.getElementById('counter'),
    handler() {
      clearSVG();
      window.counterIsInView = true;
      addCounter();
    },
    offset: '20%',
  });
}

const sections = d3.selectAll('.sections section');
const sectionPos = [];
let topSectionPos;

sections.each(function (d, i) {
  const top = this.getBoundingClientRect().top;
  if (i === 0) {
    topSectionPos = top;
  }
  sectionPos.push(top - topSectionPos);
});

function getSection(direction) {
  const pos = window.pageYOffset;
  const next = d3.bisect(sectionPos, pos);
  if (direction === 'prev') {
    return Math.max(0, next - 1);
  }
  return Math.min(sections.size() - 1, next);
}

document.addEventListener('keyup', (e) => {
  if (e.keyCode == 32) {
    sections[0][getSection('next')].scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
});
