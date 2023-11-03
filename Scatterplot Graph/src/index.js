// invert yAxis
// change xAxis to date 
// ensure xAxis includes every year
// compare with code camp example, notably scaleOrdinal and invert for colors?

import "./main.scss"
import { timeParse } from "./time"

async function fetchData() {
    const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    const data = await response.json()

    const w = 900
    const h = 600
    const padding = 100

    const svg = d3.select("#container")
        .append("svg")
        .attr("width", "900")
        .attr("height", "600")

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, (d) => d.Year)) // extent returns [min, max]
        .range([padding, w - padding])
        .nice()
    const yScale = d3.scaleTime() // scaleOrdinal would have worked as well 
        .domain(d3.extent(data, (d) => timeParse(d.Time)))
        .range([h - padding, padding])
        .nice()

    const timeFormat = d3.timeFormat("%M:%S")
    const xAxis = d3.axisBottom(xScale)
    // .ticks(20)
    const yAxis = d3.axisLeft(yScale)
        .ticks(10, timeFormat)

    svg.append("g")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis)
    svg.append("g")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", "100")
        .attr("cy", "100")
        .attr("r", 5)
        .attr("fill", "black")

    console.log(
        data,
        d3.extent(data, (d) => timeParse(d.Time)),
        yScale(timeParse(data[10].Time))
    )
}

fetchData()
