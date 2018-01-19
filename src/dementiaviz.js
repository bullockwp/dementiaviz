const grey = '#666';
const red = '#c9252c';
const pink = '#da3e7b';
const orange = '#f15a22';
const green = '#00a05b';
const blue = '#0071ae';
const purple = '#6950a1';
const yellow = '#f2be1a';

/* const stamenLite = new L.StamenTileLayer('toner-lite');
const stamenLabels = new L.StamenTileLayer('toner-labels');
const map = L.map('map', {
  center: [13.75, 100.75],
  zoom: 11,
  layers: [stamenLite],
  scrollWheelZoom: false,
}).on('viewreset', reset);

map.keyboard.disable();

const overlayMaps = { Map: stamenLite, Labels: stamenLabels };
L.control.layers(overlayMaps).addTo(map); */

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

/* const layer = svg.append('g').attr('class', 'leaflet-zoom-hide');

function projectPoint(x, y) {
  const point = map.latLngToLayerPoint(new L.LatLng(y, x));
  this.stream.point(point.x, point.y);
}

function projectCoordinate(c) {
  const point = map.latLngToLayerPoint(new L.LatLng(c[1], c[0]));
  return [point.x, point.y];
} */

/* const transform = d3.geo.transform({ point: projectPoint });
const path = d3.geo.path().projection(transform);
let districts;
let districtPaths,
  marketPoints;
let districtData,
  districtDataLookup;
let colorScales; */

/* function r() {
  return Math.max(map.getZoom() - 10, 0) * 1.5 + 1;
} */

/* function reset() {
  const bounds = path.bounds(districts);
  const topLeft = bounds[0];
  const bottomRight = bounds[1];

  svg
    .attr('width', bottomRight[0] - topLeft[0])
    .attr('height', bottomRight[1] - topLeft[1])
    .style('left', `${topLeft[0]}px`)
    .style('top', `${topLeft[1]}px`);

  layer.attr('transform', `translate(${-topLeft[0]},${-topLeft[1]})`);
  update();
}

function update() {
  districtPaths.attr('d', path);
  d3.select('.district-base path').attr('d', path);
  d3
    .selectAll('circle.point')
    .attr('r', r)
    .attr('cx', d => projectCoordinate(d.geometry.coordinates)[0])
    .attr('cy', d => projectCoordinate(d.geometry.coordinates)[1])
    .style('stroke-width', r() * 2);
} */
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
    .attr('class', 'arc hidden')
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

  return [arc, pie, arcs];
}

// This block of code modified from https://bl.ocks.org/mbostock/1346410
// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a, arc) {
  const i = d3.interpolate(this._current, a);
  this._current = i(0);
  return t => arc(i(t));
}

function arcTransition(arc, pie, arcs, data) {
  arcs
    .data(pie(data))
    .transition()
    .duration(1000)
    .attrTween('d', d => arcTween(d, arc));
}

d3
  .queue()
  .defer(d3.csv, '../data/csv/population-estimates.csv', rowConverter)
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

    let numClicks = 0;

    d3.selectAll('rect').on('click', () => {
      if (numClicks % 2 === 0) {
        drawBarPlot(estimates2030, (transition = true));
      } else {
        drawBarPlot(estimates2015, (transition = true));
      }
      numClicks += 1;
    });

    const returns = drawPieChart(estimates2015);
    const arc = returns[0];
    const pie = returns[1];
    const arcs = returns[2];

    let numClicksPie = 0;

    arcTransition(arc, pie, arcs, estimates2015);

    d3.selectAll('path.arc').on('click', () => {
      console.log('clicked');
      if (numClicksPie % 2 === 0) {
        arcTransition(arc, pie, arcs, estimates2030);
      } else {
        arcTransition(arc, pie, arcs, estimates2015);
      }
      numClicksPie += 1;
    });
  });

/* d3
  .queue()
  .defer(d3.json, 'dementiaviz.json')
  .defer(d3.csv, 'dataByDistrict.csv')
  .await((error, topo, csv) => {
    if (error) throw error;

    districtData = csv.map((row) => {
      Object.keys(row)
        .filter(d => d !== 'district')
        .map((key) => {
          // parse numbers
          row[key] = +row[key];
          return row;
        })
        .filter(d => d !== 'ประชากร' && d !== 'จำนวนคลอง' && d !== 'ปริมาณน้ำฝน (มม)')
        .forEach((key) => {
          // normalize by population
          row[key] = row[key] / row['ประชากร'];
        });
      return row;
    });
    districtDataLookup = districtData.reduce((acc, curr) => {
      acc[curr.district] = curr;
      return acc;
    }, {});

    colorScales = Object.keys(districtData[0])
      .filter(d => d !== 'district')
      .reduce((acc, curr) => {
        acc[curr] = d3.scale
          .quantize()
          .domain(d3.extent(districtData, d => d[curr]))
          .range(['#edf8fb', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#005824']);
        return acc;
      }, {});

    districts = topojson.feature(topo, topo.objects.district);

    layer
      .append('g')
      .classed('district-base', true)
      .append('path')
      .datum(topojson.merge(topo, topo.objects.district.geometries));

    districtPaths = layer
      .append('g')
      .classed('district-layer', true)
      .selectAll('.district')
      .data(districts.features)
      .enter()
      .append('path')
      .attr('class', 'district')
      .on('wheel', (d, i) => {
        hidePopup();
      })
      .on('mouseover', (d, i) => {
        const ev = d3.event;
        showPopup(ev.pageX, ev.pageY, d.properties.dname);
      })
      .on('mouseout', (d, i) => {
        hidePopup();
      })
      .on('mousemove', (d, i) => {
        const ev = d3.event;
        showPopup(ev.pageX, ev.pageY);
      });

    // console.log('topo.objects', topo.objects);

    // draw bts stations
    drawPoints(
      layer.append('g').classed('bts-layer', true),
      topojson.feature(topo, topo.objects.bts_station).features,
    );
    // draw mrt stations
    drawPoints(
      layer.append('g').classed('mrt-layer', true),
      topojson.feature(topo, topo.objects.mrt_station).features,
    );
    // draw train stations
    drawPoints(
      layer.append('g').classed('train-layer', true),
      topojson.feature(topo, topo.objects.train_station).features,
    );
    // draw chaopraya piers
    drawPoints(
      layer.append('g').classed('chaopraya-layer', true),
      topojson.feature(topo, topo.objects.chaopraya_pier).features,
    );
    // draw sansab piers
    drawPoints(
      layer.append('g').classed('sansab-layer', true),
      topojson.feature(topo, topo.objects.sansab_pier).features,
    );
    // draw airport link stations
    drawPoints(
      layer.append('g').classed('airportlink-layer', true),
      topojson.feature(topo, topo.objects.airportlink_station).features,
    );
    // draw markets
    drawPoints(
      layer.append('g').classed('market-layer', true),
      topojson.feature(topo, topo.objects.market).features,
    );
    // draw department stores
    drawPoints(
      layer.append('g').classed('department-store-layer', true),
      topojson.feature(topo, topo.objects.department_store).features,
    );
    // draw golf courses
    drawPoints(
      layer.append('g').classed('golf-course-layer', true),
      topojson.feature(topo, topo.objects.golf_course).features,
    );
    // draw parks
    drawPoints(
      layer.append('g').classed('park-layer', true),
      topojson.feature(topo, topo.objects.public_park).features,
    );

    reset();
    initWaypoints();
  }); */

initWaypoints();

/* function drawPoints(container, features) {
  console.log(`${container.attr('class')}  ${features.length}`);
  container
    .selectAll('.point')
    .data(features)
    .enter()
    .append('circle')
    .classed('point', true)
    .classed('hidden', true) // Hide all points initially
    .attr('r', 0)
    .attr('cx', d => projectCoordinate(d.geometry.coordinates)[0])
    .attr('cy', d => projectCoordinate(d.geometry.coordinates)[1])
    .on('wheel', (d, i) => {
      hidePopup();
    })
    .on('mouseover', (d, i) => {
      const ev = d3.event;
      showPopup(
        ev.pageX,
        ev.pageY,
        d.properties.name ||
          d.properties.mar_name ||
          d.properties.golf_name ||
          d.properties.park_name ||
          d.properties.NAME,
      );
    })
    .on('mouseout', (d, i) => {
      hidePopup();
    });
}

function hideAllPoints() {
  d3
    .selectAll('circle.point')
    .classed('hidden', true)
    .attr('r', 0);
}

function showDistricts() {
  d3
    .select('.district-layer')
    // .classed('hidden', false)
    .transition()
    .duration(400)
    .style('fill-opacity', 1);
}

function hideDistricts() {
  d3
    .select('.district-layer')
    // .classed('hidden', true) // Need this to disable mouseover polygons
    .style('fill-opacity', 0)
    .style('fill', 'none');
}

function colorDistrict(colorOrFunc) {
  districtPaths.style('fill', d3.functor(colorOrFunc));
}

function colorDistrictByField(field) {
  colorDistrict((d) => {
    const district = d.properties.dname.replace('เขต', '');
    const data = districtDataLookup[district];
    if (data) return colorScales[field](data[field]);
    return '#ccc';
  });
}

function drawTransit(system) {
  d3
    .selectAll('.bts-layer circle.point')
    .classed('hidden', false)
    .transition()
    .duration(500)
    .attr('r', r)
    .style('stroke-width', r() * 2)
    .style('fill', system == 'bts' ? red : grey)
    .style('stroke', system == 'bts' ? red : grey);
  d3
    .selectAll('.mrt-layer circle.point')
    .classed('hidden', false)
    .transition()
    .duration(500)
    .attr('r', r)
    .style('stroke-width', r() * 2)
    .style('fill', system == 'mrt' ? red : grey)
    .style('stroke', system == 'mrt' ? red : grey);
  d3
    .selectAll('.airportlink-layer circle.point')
    .classed('hidden', false)
    .transition()
    .duration(500)
    .attr('r', r)
    .style('stroke-width', r() * 2)
    .style('fill', system == 'airportlink' ? red : grey)
    .style('stroke', system == 'airportlink' ? red : grey);
  d3
    .selectAll('.chaopraya-layer circle.point')
    .classed('hidden', false)
    .transition()
    .duration(500)
    .attr('r', r)
    .style('stroke-width', r() * 2)
    .style('fill', system == 'water' ? orange : grey)
    .style('stroke', system == 'water' ? orange : grey);
  d3
    .selectAll('.sansab-layer circle.point')
    .classed('hidden', false)
    .transition()
    .duration(500)
    .attr('r', r)
    .style('stroke-width', r() * 2)
    .style('fill', system == 'water' ? purple : grey)
    .style('stroke', system == 'water' ? purple : grey);
  d3
    .selectAll('.train-layer circle.point')
    .classed('hidden', false)
    .transition()
    .duration(500)
    .attr('r', r)
    .style('stroke-width', r() * 2)
    .style('fill', system == 'train' ? red : grey)
    .style('stroke', system == 'train' ? red : grey);
} */

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
  // d3
  //   .select('#plot-area')
  //   .selectAll('*')
  //   .remove();

  d3
    .select('#plot-area')
    .select('svg')
    .selectAll('image')
    .data(img)
    .enter()
    // .append('svg')
    // .attr('width', 600)
    // .attr('height', 700)
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
    handler() {
      clearSVG();
      
      drawBarPlot(window.estimates2015, (transition = false));

      d3.select('.bar-plot').classed('hidden', false);
    },
    offset: '20%',
  });

  const populationBar2 = new Waypoint({
    element: document.getElementById('population-bar2'),
    handler() {
      drawBarPlot(window.estimates2030, (transition = true));
    },
    offset: '20%',
  });

  /*   new Waypoint({
    element: document.getElementById('transport-intro'),
    handler(direction) {
      hideDistricts(); // Perhaps we shouldn't hide districts?
      hideAllPoints();
      drawTransit('');
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('transport-0'),
    handler(direction) {
      hideDistricts(); // Perhaps we shouldn't hide districts?
      hideAllPoints();
      drawTransit('bts');
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('transport-1'),
    handler(direction) {
      hideDistricts();
      hideAllPoints();
      drawTransit('mrt');
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('transport-2'),
    handler(direction) {
      hideDistricts();
      hideAllPoints();
      drawTransit('airportlink');
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('transport-3'),
    handler(direction) {
      hideDistricts();
      hideAllPoints();
      drawTransit('water');
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('transport-4'),
    handler(direction) {
      hideDistricts();
      hideAllPoints();
      drawTransit('train');
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('market-vs-mall-0'),
    handler(direction) {
      hideDistricts();
      hideAllPoints();
      d3
        .selectAll('.market-layer circle.point')
        .classed('hidden', false)
        .transition()
        .duration(500)
        .attr('r', r)
        .style('stroke-width', r() * 2)
        .style('fill', grey)
        .style('stroke', grey);
      d3
        .selectAll('.department-store-layer circle.point')
        .classed('hidden', false)
        .transition()
        .duration(500)
        .attr('r', r)
        .style('stroke-width', r() * 2)
        .style('fill', grey)
        .style('stroke', grey);
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('market-vs-mall-1'),
    handler(direction) {
      hideDistricts();
      hideAllPoints();
      d3
        .selectAll('.market-layer circle.point')
        .classed('hidden', false)
        .transition()
        .attr('r', r)
        .style('stroke-width', r() * 2)
        .style('fill', orange)
        .style('stroke', orange);
      d3
        .selectAll('.department-store-layer circle.point')
        .classed('hidden', false)
        .transition()
        .attr('r', r)
        .style('stroke-width', r() * 2)
        .style('fill', blue)
        .style('stroke', blue);
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('golfcourse-vs-park-0'),
    handler(direction) {
      hideDistricts();
      hideAllPoints();
      d3
        .selectAll('.golf-course-layer circle.point')
        .classed('hidden', false)
        .transition()
        .duration(500)
        .attr('r', r)
        .style('stroke-width', r() * 2)
        .style('fill', grey)
        .style('stroke', grey);
      d3
        .selectAll('.park-layer circle.point')
        .classed('hidden', false)
        .transition()
        .duration(500)
        .attr('r', r)
        .style('stroke-width', r() * 2)
        .style('fill', grey)
        .style('stroke', grey);
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('golfcourse-vs-park-1'),
    handler(direction) {
      hideDistricts();
      hideAllPoints();
      d3
        .selectAll('.golf-course-layer circle.point')
        .classed('hidden', false)
        .transition()
        .attr('r', r)
        .style('stroke-width', r() * 2)
        .style('fill', blue)
        .style('stroke', blue);
      d3
        .selectAll('.park-layer circle.point')
        .classed('hidden', false)
        .transition()
        .attr('r', r)
        .style('stroke-width', r() * 2)
        .style('fill', orange)
        .style('stroke', orange);
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('marriage'),
    handler(direction) {
      hideAllPoints();
      colorDistrictByField('สมรส');
      showDistricts();
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('divorce'),
    handler(direction) {
      hideAllPoints();
      showDistricts();
      colorDistrictByField('หย่าร้าง');
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('park'),
    handler(direction) {
      hideAllPoints();
      showDistricts();
      colorDistrictByField('พื้นที่สวน (ตรม.)');
    },
    offset: '10%',
  });

  // Clear data from previous slide
  new Waypoint({
    element: document.getElementById('district-custom'),
    handler(direction) {
      hideAllPoints();
      showDistricts();
      colorDistrict('rgba(0,0,0,0.1)');
      map.addLayer(stamenLabels);
      map.removeLayer(stamenLite);
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('temple'),
    handler(direction) {
      hideAllPoints();
      showDistricts();
      colorDistrictByField('วัด');
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('massage'),
    handler(direction) {
      hideAllPoints();
      showDistricts();
      colorDistrictByField('อาบอบนวด');
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('temple-massage-0'),
    handler(direction) {
      hideAllPoints();
      showDistricts();
      colorDistrict((d) => {
        const district = d.properties.dname.replace('เขต', '');
        const data = districtDataLookup[district];
        if (data) {
          const m = data['อาบอบนวด'];
          const t = data['วัด'];
          const colorScale = d3.scale
            .linear()
            .domain([0, 0.5, 1])
            .range(['#f2be1a', 'white', '#da3e7b']);
          return colorScale(m / (m + t));
        }
        return '#ccc';
      });
    },
    offset: '10%',
  });

  new Waypoint({
    element: document.getElementById('end'),
    handler(direction) {
      showDistricts();
      colorDistrict(null);
      hideAllPoints();
      map.addLayer(stamenLite);
      map.removeLayer(stamenLabels);
    },
    offset: '10%',
  }); */
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

/* d3.selectAll('#district-field-radios input[type=radio]').on('click', function (d) {
  colorDistrictByField(this.value);
}); */
