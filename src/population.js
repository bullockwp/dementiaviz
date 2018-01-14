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
    let svg = d3
      .select('.plot')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    svg
      .selectAll('rect')
      .data(estimates2015)
      .enter()
      .append('rect')
      .attr('data-age', d => d.age)
      .attr('x', padding)
      .attr('y', (d, i) => yScale(i))
      .attr('width', d => xScale(d.estimate))
      .attr('height', yScale.bandwidth())
      .attr('fill', 'purple')
      .attr('opacity', (d, i) => 0.33 * (i + 1));

    let numClicks = 0;

    d3.selectAll('rect').on('click', () => {
      console.log('clicked');

      if (numClicks % 2 === 0) {
        svg
          .selectAll('rect')
          .data(estimates2030)
          .transition()
          .attr('x', padding)
          .attr('y', (d, i) => yScale(i))
          .attr('width', d => xScale(d.estimate))
          .attr('height', yScale.bandwidth())
          .attr('fill', 'purple')
          .attr('opacity', (d, i) => 0.33 * (i + 1));
      } else {
        svg
          .selectAll('rect')
          .data(estimates2015)
          .transition()
          .attr('x', padding)
          .attr('y', (d, i) => yScale(i))
          .attr('width', d => xScale(d.estimate))
          .attr('height', yScale.bandwidth())
          .attr('fill', 'purple')
          .attr('opacity', (d, i) => 0.33 * (i + 1));
      }

      numClicks += 1;
    });
  });
