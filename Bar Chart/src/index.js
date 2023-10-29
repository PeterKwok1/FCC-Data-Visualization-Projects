import "./main.scss"
import { date } from "./date"

async function fetchData() {
    const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    const data = (await response.json()).data

    const w = 720
    const h = 480
    const padding = 50

    const xScale = d3.scaleTime()
        .domain([d3.min(data, (d) => date(d[0])), d3.max(data, (d) => date(d[0]))])
        .range([padding, w - padding])
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d[1])])
        .range([h - padding, padding])

    const svg = d3.select("#container")
        .append("svg")
        .attr("width", w)
        .attr("height", h)

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("data-date", (d, i) => data[i][0])
        .attr("data-gdp", (d, i) => `${data[i][1]}`)
        .attr("x", (d, i) => w / data.length * i)
        .attr("y", (d, i) => h - d[1])
        .attr("width", 8)
        .attr("height", (d, i) => d[1])
        .attr("fill", "#87CEEB")
        .attr("class", "bar") //hover 
        .append("title")
        .text(d => d[0]) // tooltip

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis)

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)

    console.log(date(data[270][0]))
}

fetchData()

