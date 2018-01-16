// //old data
// const dataset = [
//     { x:'Dementias',  y:1541880},
//     { x:'SARS', y:775},
//     { x:'MERS', y:90},
//     { x:'Dengue', y:162},
//     { x:'Cholera', y:3190},
//     { x:'Menigitis', y:931},
//     { x:'Influenza', y:8160},
//     { x:'Measles', y:900},
//     { x:'Yellow Fever', y:624},
//     { x:'Ebola', y:3767}
// ];

//new data
const dataset = [
    { x:'Dementias',  y:1540000}, //http://www.who.int/mediacentre/factsheets/fs310/en/
    { x:'Tuberculosis',  y:1400000}, // http://www.who.int/mediacentre/factsheets/fs310/en/
    { x:'HIV/AIDS', y:1100000}, //http://apps.who.int/gho/data/view.main.22600REG?lang=en
    { x:'Influenza', y:650000}, //http://www.who.int/mediacentre/factsheets/fs211/en/  (upper estimate)
    { x:'Malaria', y:429000}, //http://www.who.int/features/factfiles/malaria/en/
    { x:'Cholera', y:100000}, //http://www.who.int/mediacentre/factsheets/fs107/en/
    { x:'Measles', y:90000}, //http://www.who.int/mediacentre/factsheets/fs286/en/
    { x:'Yellow Fever', y:50000}, //http://www.who.int/mediacentre/factsheets/fs100/en/
    { x:'Ebola', y:3770}, //http://apps.who.int/gho/data/view.ebola-sitrep.ebola-summary-latest?lang=en
    { x:'SARS', y:775},
    { x:'MERS', y:90},

    // { x:'Menigitis', y:930}, //might delete these  - data uncertain
    // { x:'Dengue', y:160},
];

// http://www.who.int/mediacentre/factsheets/fs310/en/

console.log(dataset);

// set the dimensions and margins of the graph
let margin = {top: 20, right: 20, bottom: 100, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// set the ranges
let x = d3.scaleBand()
    .range([0, width])
    .padding(0.3);
let y = d3.scaleLinear()
    .range([height, 0]);


let svg = d3.select("body").select('#bar1')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


// Scale the range of the data in the domains
x.domain(dataset.map(function(d) { return d.x; }));
y.domain([0, d3.max(dataset, function(d) { return d.y; })]);

// append the rectangles for the bar chart
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.y); })
    .attr("height", function(d) { return height - y(d.y); })
    .attr("fill", 'steelblue');

// Create Text Labels
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d){
        return d.y; // Value in array is the text
    })
    .attr("x", function(d) { return x(d.x) + 25; })
    .attr("y", function(d) { return y(d.y) - 10; })
    .attr("font-family", "sans-serif") // Change text font
    .attr("font-size", "11px") // Font size
    .attr("text-anchor", "middle"); // Align to middle

// add the x Axis
svg.append("g")
    .attr("class", "xaxis axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

svg.selectAll(".xaxis text")  // select all the text elements for the xaxis
//need to understand the below better
    .attr("transform", function(d) {
        return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height +  ")rotate(-45)";
    });

// add the y Axis
svg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y));










// https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
// http://bl.ocks.org/phoebebright/3061203
// http://bl.ocks.org/WilliamQLiu/0aab9d28ab1905ac2c8d
















////Old Method


//set viewport size
//
// let width = 600;
// let height = 800;
// let padding = 10;
// let barPadding = 10;

// let svg1 = d3.select("body")
//     .select("#bar1").attr("width", width).attr("height", height);
//
// svg1.selectAll("rect")
//     .data(dataset)
//     .enter()
//     .append("rect")
//     .attr("x", function(d, i) {
//         return i * (width / dataset.length);
//     })
//     .attr("y", function(d) {
//         return height - (d/2000);
//     })
//     .attr("width", width / dataset.length - barPadding)
//     .attr("height", function(d) {
//         return d/2000;
//     })
//     .attr("fill", "teal");
//


