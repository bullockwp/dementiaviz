(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.diseasePlot = global.diseasePlot || {})));
}(this, (function (exports) {

//  //data declaration
// Malignant Neoplasms
    const MalignantNeoplasms1 = [
        {xValue: 2000, yValue: 1.0},
        {xValue: 2005, yValue: 1.02}
    ];

    const MalignantNeoplasms2 = [
        {xValue: 2000, yValue: 1.0},
        {xValue: 2005, yValue: 1.02},
        {xValue: 2010, yValue: 1.03},
    ];

    const MalignantNeoplasms3 = [
        {xValue: 2000, yValue: 1.0},
        {xValue: 2005, yValue: 1.02},
        {xValue: 2010, yValue: 1.03},
        {xValue: 2015, yValue: 1.05}
    ];

// Cardiovascular diseases
    const CardioDisease1 = [
        {xValue: 2000, yValue: 1.0},
        {xValue: 2005, yValue: 1.0},
    ];

    const CardioDisease2 = [
        {xValue: 2000, yValue: 1.0},
        {xValue: 2005, yValue: 1.0},
        {xValue: 2010, yValue: 1.02},
    ];

    const CardioDisease3 = [
        {xValue: 2000, yValue: 1.0},
        {xValue: 2005, yValue: 1.0},
        {xValue: 2010, yValue: 1.02},
        {xValue: 2015, yValue: 1.02},
    ];

// Alzheimer disease and other dementias
    const Dementias1 = [
        {xValue: 2000, yValue: 1.0},
        {xValue: 2005, yValue: 1.22}
    ];

    const Dementias2 = [
        {xValue: 2000, yValue: 1.0},
        {xValue: 2005, yValue: 1.22},
        {xValue: 2010, yValue: 1.56},
    ];

    const Dementias3 = [
        {xValue: 2000, yValue: 1.0},
        {xValue: 2005, yValue: 1.22},
        {xValue: 2010, yValue: 1.56},
        {xValue: 2015, yValue: 1.97},
    ];

    const purple = '#6A5D93';
    const red = '#C74C63';
    const blue ='#387FAA';

    function drawRatePlot() {

// viewport
    let margin = {top: 100, right: 100, bottom: 100, left: 100},
        width = 1000 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

// Set the ranges
    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

// define the line
    const valueline = d3.line()
        .x(function (d) {
            return x(d.xValue);
        })
        .y(function (d) {
            return y(d.yValue);
        });
    // .curve(d3.curveMonotoneX); // apply smoothing to the line, breaks animations

    let svg = d3
        .select('#plot-area')
        .select('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

// fitting first data series
    let dataset = MalignantNeoplasms1;

// Scale the range of the data in the domains
    x.domain(dataset.map(function (d) {
        return (d.xValue);
    }));
    y.domain([0.95, d3.max(dataset, function (d) {
        return (d.yValue + 0.2);
    })]);

    let g = svg.append('g')
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// create line
// plotting the first half of the data only
    g
        .append('path')
        .datum(CardioDisease1)
        .attr('id', 'cardio1')
        .style('stroke', red)
        .style('stroke-width', 5)
        .style('opacity', 1)
        .attr('d', valueline);

    g
        .append('path')
        .datum(MalignantNeoplasms1)
        .attr('id', 'mn1')
        .style('stroke', blue)
        .style('stroke-width', 5)
        .style('opacity', 1)
        .attr('d', valueline);

// Add the X Axis
    g.append("g")
        .attr('class', 'xaxis')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .ticks(5)
            .tickFormat(d3.format('')));

// Add the Y Axis
    g.append("g")
        .attr('class', 'yaxis')
        .call(d3.axisLeft(y));

// Labelling
    g
        .append('text')
        .attr('class', 'x label')
        .attr('x', width / 2)
        .attr('y', height + 35)
        .text('Year')
        .attr("font-family", "sans-serif")
        .attr("font-size", "18px")
        .attr('text-anchor', 'end');

    g
        .append('text')
        .attr('class', 'y label')
        .attr('y', -35)
        .attr('x', height / -2)
        .text('Rate of Increase')
        .attr("font-family", "sans-serif")
        .attr("font-size", "18px")
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-90)');

    let legend = g.selectAll(".legend")
        .data(['Alzheimer\'s Disease and Other Dementias', 'Malignant Neoplasms','Cardiovascular Diseases'])
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    const colour = [purple, blue, red];

// draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 800)
        .attr("y", height + 40)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", function (d, i) {
            return colour[i]
        })
        .style("stroke", "gray")
        .style("stroke-width", 0.25);

// draw legend text
    legend.append("text")
        .attr("x", width - 765)
        .attr("y", height + 55)
        // .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d) {
            return d;
        });


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

            }
        });


    function updateOne() {

        dataset = Dementias1;

        x.domain(dataset.map(function (d) {
            return (d.xValue);
        }));
        y.domain([0.95, d3.max(dataset, function (d) {
            return (d.yValue + 0.2);
        })]);

        g.select(".xaxis") // update the x axis
            .transition()
            .duration(1000)
            .call(d3.axisBottom(x)
                .ticks(5)
                .tickFormat(d3.format('')));


        g.select(".yaxis") // update the x axis
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

        g.append('path')
            .datum(Dementias1)
            .attr('id', 'dementia1')
            .style('stroke', purple)
            .style('stroke-width', 5)
            .style('opacity', 1)
            .attr('d', valueline);

    }

    function updateTwo() {

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

        x.domain([2000, d3.max(dataset, function (d) {
            return (d.xValue);
        })]);
        // x.domain(dataset.map(function(d) { return (d.xValue); }));
        y.domain([0.95, d3.max(dataset, function (d) {
            return (d.yValue + 0.2);
        })]);

        d3.select('#cardio1')
            .transition()
            .duration(1000)
            .attr("d", valueline(CardioDisease2))
            .style('opacity', 0.5);

        d3.select('#dementia1')
            .transition()
            .duration(1000)
            .attr("d", valueline(Dementias2))
            .style('opacity', 1);


        d3.select('#mn1')
            .transition()
            .duration(1000)
            .attr("d", valueline(MalignantNeoplasms2))
            .style('opacity', 0.5);

        g.select(".xaxis") // update the x axis
            .transition()
            .duration(1000)
            .call(d3.axisBottom(x)
                .ticks(10)
                .tickFormat(d3.format('')));


        g.select(".yaxis") // update the x axis
            .transition()
            .duration(1000)
            .call(d3.axisLeft(y));

    }

    function updateFour() {

        dataset = Dementias3;

        x.domain([2000, d3.max(dataset, function (d) {
            return (d.xValue);
        })]);
        // x.domain(dataset.map(function(d) { return (d.xValue); }));
        y.domain([0.95, d3.max(dataset, function (d) {
            return (d.yValue + 0.2);
        })]);

        d3.select('#cardio1')
            .transition()
            .duration(1000)
            .attr("d", valueline(CardioDisease3))
            .style('opacity', 0.5);

        d3.select('#dementia1')
            .transition()
            .duration(1000)
            .attr("d", valueline(Dementias3))
            .style('opacity', 1);

        d3.select('#mn1')
            .transition()
            .duration(1000)
            .attr("d", valueline(MalignantNeoplasms3))
            .style('opacity', 0.5);

        g.select(".xaxis") // update the x axis
            .transition()
            .duration(1000)
            .call(d3.axisBottom(x)
                .ticks(15)
                .tickFormat(d3.format('')));

        g.select(".yaxis") // update the x axis
            .transition()
            .duration(1000)
            .call(d3.axisLeft(y));
    }

    exports.updateOne = updateOne;
    exports.updateTwo = updateTwo;
    exports.updateThree = updateThree;
    exports.updateFour = updateFour;
}

exports.drawRatePlot = drawRatePlot;

Object.defineProperty(exports, '__esModule', { value: true });

})));