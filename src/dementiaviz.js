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

const svg = d3
  .select('#plot-area')
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100%');

// Function for converting CSV values from strings to integers
function rowConverter(d) {
  return {
    area: d.area,
    code: d.code,
    // year: new Date(+d.year),
    year: parseInt(d.year),
    total: parseInt(d.total),
    '0-14': parseInt(d['0-14']),
    '15-64': parseInt(d['15-64']),
    '65+': parseInt(d['65+']),
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

function drawBarPlot(data, transition = false) {
  const w = 700;
  const h = 500;
  const padding = 40;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(window.estimates2030, d => d.estimate)])
    // .domain([0, 7000000])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleBand()
    .domain(d3.range(3))
    .rangeRound([h - padding, padding])
    .paddingInner(0.05);

  svg.append('g').attr('class', 'bar-plot');

  const bars = svg
    .select('g.bar-plot')
    .selectAll('rect')
    .data(data);

  if (transition) {
    bars
      .transition()
      .attr('data-age', d => d.age)
      .attr('x', padding)
      .attr('y', (d, i) => yScale(i))
      .attr('width', d => xScale(d.estimate))
      .attr('height', yScale.bandwidth())
      .attr('fill', purple)
      .attr('opacity', (d, i) => 0.33 * (i + 1));
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
      .attr('opacity', (d, i) => 0.33 * (i + 1));
  }
}

function drawPieChart(data) {
  const w = 500;
  const h = 500;
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
    .attr('transform', `translate(${outerRadius},${outerRadius})`);

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
    });

  // Labels
  // arcs
  //   .append('text')
  //   .attr('transform', d => `translate(${arc.centroid(d)})`)
  //   .attr('text-anchor', 'middle')
  //   .text(d => d.data.age);

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
    .attr('x', 0)
    .attr('y', 100)
    .attr('width', 600)
    .attr('height', 600);
}

// Waypoints
function initWaypoints() {
  const cover = new Waypoint({
    element: document.getElementById('cover'),
    handler() {
      clearSVG();
      d3.select('.bar-plot').classed('hidden', true);
      const text = ['[cover picture]'];
      addText(text);
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
