// tests don't seem to want me to adjust rect position. will have to move y axis and add path to bottom.
// colors - https://observablehq.com/@d3/color-schemes

import "./main.scss"
import * as dateParse from "./date-parse"

async function fetchData() {
    const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    const data = await response.json()
    const baseTemp = data.baseTemperature
    const dataset = data.monthlyVariance

    const h = 600
    const w = 900
    const padding = 100

    const svg = d3.select("#container")
        .append("svg")
        .attr("height", h)
        .attr("width", w)
        .style("background-color", "white")
        .style("box-shadow", "3px 3px 15px")

    svg.append("text")
        .attr("id", "title")
        .attr("x", `${w / 2}`)
        .attr("y", "50")
        .text("Heat Map")
        .attr("text-anchor", "middle")
        .style("font-size", "30px")

    svg.append("text")
        .attr("id", "description")
        .attr("x", `${w / 2}`)
        .attr("y", "75")
        .text(`Monthly temperature variance 1753-2015, Base temperature = 8.66${String.fromCharCode(176)}C`)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")

    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, (d) => dateParse.yearParse(d.year.toString())))
        .range([padding, w - padding])
    const yScale = d3.scaleTime()
        .domain(d3.extent(dataset, (d) => dateParse.monthParse(d.month.toString())))
        .range([h - padding, padding + (h - padding * 2) / 12])
    const colorScale = d3.scaleOrdinal()
        .domain(d3.extent(dataset, (d) => baseTemp + d.variance))
        .range(["#fff5eb", "#fee7cf", "#fdd4ab", "#fdb97e", "#fd9c51", "#f77d2a", "#e85e0e", "#cc4503", "#a33503", "#7f2704"]
        )

    const yearFormat = d3.timeFormat("%Y")
    const monthFormat = d3.timeFormat("%B")

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(yearFormat)
        .tickPadding([5])
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(monthFormat)
        .tickPadding([5])

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis)
    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)
        .append("path")
        .attr("d", `M 0,100 l 0,${(h - padding * 2) / 12}`)
        .attr("stroke", "currentColor");

    svg.selectAll(null)
        .data(dataset)
        .enter()
        .append("rect")
        .classed("cell", true)
        .attr("data-month", (d) => d.month)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => baseTemp + d.variance)
        .attr("x", (d) => xScale(dateParse.yearParse(d.year.toString())))
        .attr("y", (d) => yScale(dateParse.monthParse(d.month.toString())))
        .attr("height", () => (h - padding * 2) / 12)
        .attr("width", () => (w - padding * 2) / (d3.max(dataset, (d) => d.year) - d3.min(dataset, (d) => d.year)))
        .attr("fill", (d) => colorScale(baseTemp + d.variance))

    console.log(
        data,
        dataset,
    )
}

fetchData()