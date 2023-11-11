import "./main.scss"
import * as dateParse from "./date-parse"

async function fetchData() {
    const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    const data = await response.json()
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
        .text(`Monthly temperature variance, Base temperature: 8.66${String.fromCharCode(176)}C`)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")

    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, (d) => dateParse.yearParse(d.year.toString())))
        .range([padding, w - padding])
    // .nice()

    const yearFormat = d3.timeFormat("%Y")
    const monthFormat = ""

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(yearFormat)
    // .ticks()

    svg.append("g")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis)

    console.log(

    )
}

fetchData()