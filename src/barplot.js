(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.diseasePlot = global.diseasePlot || {})));
}(this, (function (exports) {

// best data so far
// from .xls on http://www.who.int/healthinfo/global_burden_disease/estimates/en/index1.html
    const data2000 = [
        { disease:'Ischaemic Heart Disease',  dr:112, td: 6883000},
        { disease:'Stroke',  dr:88, td: 5407000},
        { disease:'Lower Respiratory Infections', dr:56, td: 3408000},
        { disease:'Obstructive pulmonary disease', dr:48, td:2953000},
        { disease:'Diarrhoeal diseases', dr:36, td:2177000},
        { disease:'Tuberculosis', dr:27, td:1667000},
        { disease:'HIV/AIDS', dr:24, td: 1463000},
        { disease:'Respiratory Cancers', dr:20, td:1255000},
        { disease:'Diabetes mellitus', dr:16, td:958000},
        { disease:'Dementias', dr: 11, td:654000},

    ];

    const data2005 = [
        { disease:'Ischaemic Heart Disease',  dr:115, td:7516000},
        { disease:'Stroke',  dr:87, td: 5661000},
        { disease:'Lower Respiratory Infections', dr:50, td: 3287000},
        { disease:'Obstructive pulmonary disease', dr:44, td: 2846000},
        { disease:'Diarrhoeal diseases', dr:29, td:1884000},
        { disease:'Tuberculosis', dr:24, td:1573000},
        { disease:'HIV/AIDS', dr:29, td: 1871000},
        { disease:'Respiratory Cancers', dr:22, td:1415000},
        { disease:'Diabetes mellitus', dr:18, td:1147000},
        { disease:'Dementias', dr: 13, td:849000},
    ];

    const data2010 = [
        { disease:'Ischaemic Heart Disease',  dr:119, td:8224000},
        { disease:'Stroke',  dr:86, td:5930000},
        { disease:'Lower Respiratory Infections', dr:46, td:3209000},
        { disease:'Obstructive pulmonary disease', dr:41, td:2868000},
        { disease:'Diarrhoeal diseases', dr:23, td:1608000},
        { disease:'Tuberculosis', dr:20, td:1407000},
        { disease:'HIV/AIDS', dr:20, td:1386000},
        { disease:'Respiratory Cancers', dr:23, td:1566000},
        { disease:'Diabetes mellitus', dr:19, td:1347000},
        { disease:'Dementias', dr: 17, td:1154000},
    ];

    const data2015 = [
        { disease:'Ischaemic Heart Disease',  dr:119, td:8756000},
        { disease:'Stroke',  dr:85, td:6241000},
        { disease:'Lower Respiratory Infections', dr:43, td:3190000},
        { disease:'Obstructive pulmonary disease', dr:43, td:3170000},
        { disease:'Diarrhoeal diseases', dr:19, td:1389000},
        { disease:'Tuberculosis', dr:19, td:1373000},
        { disease:'HIV/AIDS', dr:19, td: 1060000},
        { disease:'Respiratory Cancers', dr:23, td:1695000},
        { disease:'Diabetes mellitus', dr:22, td:1586000},
        { disease:'Dementias', dr: 21, td:1542000},
    ];

    function drawDiseasePlot() {

        let svg = d3
            .select('#plot-area')
            .select('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        let dataset = data2000;

        let colour = ['#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#6A5D93'];
        dataset.sort(function (b, a) {
            return a.dr - b.dr;

        });

// set the dimensions and margins of the graph
        let margin = {top: 100, right: 100, bottom: 200, left: 100},
            width = parseInt(svg.style("width")) - margin.left - margin.right,
            height = parseInt(svg.style("height")) - margin.top - margin.bottom;
// set the ranges
        let x = d3.scaleBand()
            .range([0, width])
            .padding(0.3);

        let y = d3.scaleLinear()
            .range([height, 0]);


// Scale the range of the data in the domains
        x.domain(dataset.map(function (d) {
            return d.disease;
        }));
        y.domain([0, d3.max(dataset, function (d) {
            return d.dr;
        })]);

// append the rectangles for the bar chart
        let g = svg.append('g')
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        g.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr('class', 'diseaseBar')
            .attr("x", function (d) {
                return x(d.disease);
            })
            .attr("width", x.bandwidth())
            .attr("y", function (d) {
                return y(d.dr);
            })
            .attr("height", function (d) {
                return height - y(d.dr);
            })
            .attr("fill", function (d, i) {
                return colour[i]
            })
            .on("mouseover", function(d,i) {
                let ev = d3.event;
                let popupText = d.disease + '<br/>' + 'Estimated death rate: ' + d.dr + ' per 100000' + '<br/>' + 'Estimated Total Deaths: ' + d.td;
                showPopup(ev.pageX, ev.pageY, popupText);

            })
            .on("mouseout", function(d,i) {
                hidePopup();
            });

            //  //  old tooltip
            // .on("mouseover", function (d) {  // Create tooltip on mouse-over
            //     let xPosition = parseFloat(d3.select(this).attr("x")) + 200;
            //     let yPosition = parseFloat(d3.select(this).attr("y")) /2 + height / 2.5;
            //
            //     // Update the tooltip position and value
            //     d3.select("#tooltip")
            //         .style("left", xPosition + "px")
            //         .style("top", yPosition + "px")
            //         .html(d.disease + '<br/>' + 'Estimated death rate: ' + d.dr + ' per 100 000' + '<br/>' + 'Estimated Total Deaths: ' + d.td);
            //
            //     d3.select("#tooltip").classed("hide", false);  // Show the tooltip
            // })
            // .on("mouseout", function () {  // re-hide tooltip on mouse-out
            //     d3.select("#tooltip").classed("hide", true);  // Hide the tooltip
            // });

// Create Text Labels
        g.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .text(function (d) {
                return d.dr; // text value is the #
            })
            .attr("x", function (d) {
                return x(d.disease) + 30;
            })
            .attr("y", function (d) {
                return y(d.dr) + 15;
            })
            .attr("font-family", "sans-serif") // Change text font
            .attr("font-size", "12px") // Font size
            .style("text-anchor", "middle") // Align to middle
            .attr("fill", "white");  // Color of font

// add the x Axis
        g.append("g")
            .attr("class", "xaxis axis") //two classes for 1 object
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.selectAll(".xaxis text")  // select all the text elements for the xaxis
            .attr("transform", function (d) {
                return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height * 7 + ")rotate(-70)";
            });

// add the y Axis
        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

// Labelling axis
        g
            .append('text')
            .attr('class', 'x label')
            .attr('text-anchor', 'end')
            .attr('x', width / 2)
            .attr('y', height + 180)
            .text('Disease')
            .attr("font-family", "sans-serif") // Change text font
            .attr("font-size", "18px"); // Font size

        g
            .append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'end')
            .attr('x', -200)
            .attr('y', -50)
            .attr('transform', 'rotate(-90)')
            .text('Estimated deaths per 100 000')
            .attr("font-family", "sans-serif") // Change text font
            .attr("font-size", "18px"); // Font size

//legend definition

        let legend = g.selectAll(".legend")
            .data(['Year 2000'])
            .enter().append("g")
            .attr("class", "legend");

// draw legend text
        legend.append("text")
            .attr("x", width - 20)
            .attr("y", height - 500)
            .style("text-anchor", "end")
            .text('Year 2000')
            .attr("font-family", "sans-serif") // Change text font
            .attr("font-size", "20px"); // Font size


//  UPDATE FUNCTIONS BELOW

        function updateData2000() {

            dataset = data2000;

            colour = ['#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#6A5D93'];

            dataset.sort(function (b, a) {
                return a.dr - b.dr;
            });

// re-scale the range of the data in the domains
            x.domain(dataset.map(function (d) {
                return d.disease;
            }));
            y.domain([0, d3.max(dataset, function (d) {
                return d.dr;
            })]);

            g.selectAll("rect")
                .data(dataset)
                .transition()
                .duration(750)
                .attr("x", function (d) {
                    return x(d.disease);
                })
                .attr("width", x.bandwidth())
                .attr("y", function (d) {
                    return y(d.dr);
                })
                .attr("height", function (d) {
                    return height - y(d.dr);
                })
                .attr("fill", function (d, i) {
                    return colour[i]
                });

            // Create Text Labels
            g.selectAll("text")
                .data(dataset)
                .transition()
                .duration(750)
                .text(function (d) {
                    return d.dr;
                })
                .attr("x", function (d) {
                    return x(d.disease) + 30;
                })
                .attr("y", function (d) {
                    return y(d.dr) + 15;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("text-anchor", "middle")
                .attr("fill", "white");

            g.select(".xaxis") // update the x axis
                .transition()
                .duration(750)
                .call(d3.axisBottom(x));

// re-draw legend text
            legend.select("text")
                .transition()
                .duration(1000)
                .attr("x", width - 20)
                .attr("y", height - 500)
                .style("text-anchor", "end")
                .text('Year 2000')
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px");
        }

        function updateData2005() {

            dataset = data2005;

            colour = ['#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#6A5D93'];

            dataset.sort(function (b, a) {
                return a.dr - b.dr;
            });

// re-scale the range of the data in the domains
            x.domain(dataset.map(function (d) {
                return d.disease;
            }));
            y.domain([0, d3.max(dataset, function (d) {
                return d.dr;
            })]);

            g.selectAll("rect")
                .data(dataset)
                .transition()
                .duration(750)
                .attr("x", function (d) {
                    return x(d.disease);
                })
                .attr("width", x.bandwidth())
                .attr("y", function (d) {
                    return y(d.dr);
                })
                .attr("height", function (d) {
                    return height - y(d.dr);
                })
                .attr("fill", function (d, i) {
                    return colour[i]
                });

            // Create Text Labels
            g.selectAll("text")
                .data(dataset)
                .transition()
                .duration(750)
                .text(function (d) {
                    return d.dr;
                })
                .attr("x", function (d) {
                    return x(d.disease) + 30;
                })
                .attr("y", function (d) {
                    return y(d.dr) + 15;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("text-anchor", "middle")
                .attr("fill", "white");

            g.select(".xaxis") // update the x axis
                .transition()
                .duration(750)
                .call(d3.axisBottom(x));

// re-draw legend text
            legend.select("text")
                .transition()
                .duration(1000)
                .attr("x", width - 20)
                .attr("y", height - 500)
                .style("text-anchor", "end")
                .text('Year 2005')
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px");
        }

        function updateData2010() {

            dataset = data2010;

            colour = ['#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#6A5D93'];

            dataset.sort(function (b, a) {
                return a.dr - b.dr;
            });

// re-scale the range of the data in the domains
            x.domain(dataset.map(function (d) {
                return d.disease;
            }));
            y.domain([0, d3.max(dataset, function (d) {
                return d.dr;
            })]);

            g.selectAll("rect")
                .data(dataset)
                .transition()
                .duration(750)
                .attr("x", function (d) {
                    return x(d.disease);
                })
                .attr("width", x.bandwidth())
                .attr("y", function (d) {
                    return y(d.dr);
                })
                .attr("height", function (d) {
                    return height - y(d.dr);
                })
                .attr("fill", function (d, i) {
                    return colour[i]
                });


            // Create Text Labels
            g.selectAll("text")
                .data(dataset)
                .transition()
                .duration(750)
                .text(function (d) {
                    return d.dr;
                })
                .attr("x", function (d) {
                    return x(d.disease) + 30;
                })
                .attr("y", function (d) {
                    return y(d.dr) + 15;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("text-anchor", "middle")
                .attr("fill", "white");

            g.select(".xaxis") // update the x axis
                .transition()
                .duration(750)
                .call(d3.axisBottom(x));

// re-draw legend text
            legend.select("text")
                .transition()
                .duration(1000)
                .attr("x", width - 20)
                .attr("y", height - 500)
                .style("text-anchor", "end")
                .text('Year 2010')
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px");
        }

        function updateData2015() {

            dataset = data2015;

            colour = ['#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#387FAA', '#6A5D93', '#387FAA', '#387FAA', '#387FAA'];

            dataset.sort(function (b, a) {
                return a.dr - b.dr;
            });

// re-scale the range of the data in the domains
            x.domain(dataset.map(function (d) {
                return d.disease;
            }));
            y.domain([0, d3.max(dataset, function (d) {
                return d.dr;
            })]);

            g.selectAll("rect")
                .data(dataset)
                .transition()
                .duration(750)
                .attr("x", function (d) {
                    return x(d.disease);
                })
                .attr("width", x.bandwidth())
                .attr("y", function (d) {
                    return y(d.dr);
                })
                .attr("height", function (d) {
                    return height - y(d.dr);
                })
                .attr("fill", function (d, i) {
                    return colour[i]
                });

            // Create Text Labels
            g.selectAll("text")
                .data(dataset)
                .transition()
                .duration(750)
                .text(function (d) {
                    return d.dr;
                })
                .attr("x", function (d) {
                    return x(d.disease) + 30;
                })
                .attr("y", function (d) {
                    return y(d.dr) + 15;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("text-anchor", "middle")
                .attr("fill", "white");

            g.select(".xaxis") // update the x axis
                .transition()
                .duration(750)
                .call(d3.axisBottom(x));

// re-draw legend text
            legend.select("text")
                .transition()
                .duration(1000)
                .attr("x", width - 20)
                .attr("y", height - 500)
                .style("text-anchor", "end")
                .text('Year 2015')
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px");
        }

        exports.updateData2000 = updateData2000;
        exports.updateData2005 = updateData2005;
        exports.updateData2010 = updateData2010;
        exports.updateData2015 = updateData2015;

    }

    exports.drawDiseasePlot = drawDiseasePlot;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
