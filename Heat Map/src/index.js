// monthParse tooltip
// finish tooltip, upload

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
        .range([h - padding - ((h - padding * 2) / 12 / 2), padding + ((h - padding * 2) / 12 / 2)])
    let range = d3.extent(dataset, (d) => baseTemp + d.variance)
    let colorSpace = ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"].reverse()
    let intervals = []
    const section = (range[1] - range[0]) / 8
    let sectionCount = range[0]
    while (intervals.length < 9) {
        intervals.push(sectionCount)
        sectionCount += section
    }
    const colorScale = d3.scaleLinear()
        .domain(intervals)
        .range(colorSpace)

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

    svg.append("text")
        .text("Month")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(50, 300) rotate(270)")
    svg.append("text")
        .text("Year")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(450, 550)")

    svg.selectAll(null)
        .data(dataset)
        .enter()
        .append("rect")
        .classed("cell", true)
        .attr("data-month", (d) => d.month - 1)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => baseTemp + d.variance)
        .attr("x", (d) => xScale(dateParse.yearParse(d.year.toString())))
        .attr("y", (d) => yScale(dateParse.monthParse(d.month.toString())) - ((h - padding * 2) / 12 / 2))
        .attr("height", () => (h - padding * 2) / 12)
        .attr("width", () => (w - padding * 2) / (d3.max(dataset, (d) => d.year) - d3.min(dataset, (d) => d.year)))
        .attr("fill", (d) => colorScale(baseTemp + d.variance))
        .on("mouseover", (e) => {
            tooltip.attr("data-year", e.target.dataset.year)
            tooltip.text(`${Number(e.target.dataset.month) + 1}/${e.target.dataset.year}\n`)
        })
        .on("mouseout", (e) => {
        })

    const tooltip = d3.select("#container")
        .insert("div", ":first-child")
        .attr("id", "tooltip")
        .classed("close", true)

    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", "translate(575, 550)")
    const tempScale = d3.scaleLinear()
        .domain(range)
        .range([0, 200])
    const tempAxis = d3.axisBottom(tempScale)
    legend.append("g")
        .call(tempAxis)
    legend.selectAll(null)
        .data(intervals)
        .enter()
        .append("rect")
        .attr("height", `${200 / (intervals.length - 1)}px`)
        .attr("width", `${200 / (intervals.length - 1)}px`)
        .attr("fill", (d) => colorScale(d))
        .attr("x", (d) => tempScale(d - section / 2))
        .attr("y", "-24")
}

fetchData()