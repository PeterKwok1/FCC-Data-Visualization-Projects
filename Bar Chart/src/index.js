// https://forum.freecodecamp.org/t/d3-visualize-data-with-a-bar-chart-important-tips/567646
// https://www.youtube.com/watch?v=ywtkJkxJsdg - dialogue 

import "./main.scss"
import { date } from "./date"

async function fetchData() {
    const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    const data = (await response.json()).data

    const w = 900
    const h = 600
    const padding = 75

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

    svg.append("text")
        .attr("id", "title")
        .text("United States GDP")
        .attr("x", w / 2)
        .attr("text-anchor", "middle")
        .attr("y", padding)
        .style("font-size", "30px")

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => `${d[1]}`)
        .attr("x", (d) => xScale(date(d[0])))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", (d) => (w - 2 * padding) / data.length)
        .attr("height", (d) => h - yScale(d[1]) - padding)
        .attr("fill", "#87CEEB")
        .attr("class", "bar") //hover 
        .append("title") // tooltip
        .text(d => d[0])
        .attr("id", "tooltip")
        .attr("data-date", (d) => d[0])

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis)
        .style("font-size", "14px")

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)
        .style("font-size", "14px")

    console.log(yScale(data[200][1]))
}

fetchData()


// modal test

const openButton = document.querySelector("[data-open-modal]")
const closeButton = document.querySelector("[data-close-modal]")
const modal = document.querySelector("[data-modal]")
const overlay = document.querySelector("[data-overlay]")

openButton.addEventListener('click', () => {
    modal.classList.add("open")
    overlay.classList.add("open")
})
closeButton.addEventListener('click', () => {
    modal.classList.remove("open")
    overlay.classList.remove("open")
})
