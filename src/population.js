// Function for converting CSV values from strings to Dates and numbers
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
  const yearData = _.find(yearsData, { year: year }); // _.find ~= _.filter but returns only the first found
  const data = _.pick(yearData, ageGroups);
  const estimates = Object.entries(data).map(([age, estimate]) => ({
    age,
    estimate,
  }));
  return estimates;
}

d3
  .queue()
  .defer(d3.csv, 'data/csv/population-estimates.csv', rowConverter)
  // .defer(d3.csv, 'dataByDistrict.csv')
  .await((error, populationEstimates) => {
    if (error) throw error;

    const yearList = [2015, 2030];
    const ageGroups = ['0-14', '15-64', '65+'];

    const selectedYears = _.filter(
      populationEstimates,
      o => o.area === 'WORLD' && yearList.indexOf(o.year) > -1, // return only years in the list
    );

    const estimates2015 = getEstimates(selectedYears, ageGroups, 2015);
    const estimates2030 = getEstimates(selectedYears, ageGroups, 2030);

    // Draw a bar plot
    const w = 800;
    const h = 500;
    const padding = 40;

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(estimates2030, d => d.estimate)])
      .range([padding, w - padding]);

    const yScale = d3
      .scaleBand()
      .domain(d3.range(3))
      .rangeRound([h - padding, padding])
      .paddingInner(0.05);

    // Create SVG element
    const svg = d3
      .select('.plot')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    function drawBarPlot(data, transition = false) {
      const bars = svg.selectAll('rect').data(data);

      if (transition) {
        bars
          .transition()
          .attr('data-age', d => d.age)
          .attr('x', padding)
          .attr('y', (d, i) => yScale(i))
          .attr('width', d => xScale(d.estimate))
          .attr('height', yScale.bandwidth())
          .attr('fill', 'purple')
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
          .attr('fill', 'purple')
          .attr('opacity', (d, i) => 0.33 * (i + 1));
      }
    }

    drawBarPlot(estimates2015);

    let numClicks = 0;

    d3.selectAll('rect').on('click', () => {
      if (numClicks % 2 === 0) {
        drawBarPlot(estimates2030, (transition = true));
      } else {
        drawBarPlot(estimates2015, (transition = true));
      }
      numClicks += 1;
    });

    // Draw a pie chart
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
    const svg2 = d3
      .select('.plot2')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', `translate(${outerRadius},${outerRadius})`);

    function drawPieChart(data) {
      // Set up groups
      const arcs = svg2
        .selectAll('g.arc')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('class', 'arc')
        .attr('fill', 'purple')
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

      return arcs;
    }

    const arcs = drawPieChart(estimates2015);

    // This block of code modified from https://bl.ocks.org/mbostock/1346410
    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
      const i = d3.interpolate(this._current, a);
      this._current = i(0);
      return t => arc(i(t));
    }

    let numClicksPie = 0;

    function arcTransition(data) {
      arcs
        .data(pie(data))
        .transition()
        .duration(1000)
        .attrTween('d', arcTween);
    }

    arcTransition(estimates2015);

    d3.selectAll('path.arc').on('click', () => {
      console.log('clicked');
      if (numClicksPie % 2 === 0) {
        arcTransition(estimates2030);
      } else {
        arcTransition(estimates2015);
      }
      numClicksPie += 1;
    });
  });
