// update bar chart tool tip if this one passes test
// complete tests
// compare to fcc example

import "./main.scss"
import { hourParse } from "./time-parsers"
import { yearParse } from "./time-parsers"

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
        .style("background-color", "white")
        .style("box-shadow", "3px 3px 15px")

    svg.append("text")
        .attr("id", "title")
        .attr("x", `${w / 2}`)
        .attr("y", `50`)
        .attr("text-anchor", "middle")
        .text("Doping in Professionl Cycling")
        .style("font-size", "30")
    svg.append("text")
        .attr("x", `${w / 2}`)
        .attr("y", `75`)
        .attr("text-anchor", "middle")
        .text("35 Fastest times up Alpe d'Huez")
        .style("font-size", "18")

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, (d) => yearParse(d.Year))) // extent returns [min, max]
        .range([padding, w - padding])
        .nice()
    const yScale = d3.scaleTime()
        .domain(d3.extent(data, (d) => hourParse(d.Time)))
        .range([h - padding, padding])
        .nice()

    const yearFormat = d3.timeFormat("%Y")
    const hourFormat = d3.timeFormat("%M:%S")
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(yearFormat)
        .ticks(22)
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(hourFormat)
        .ticks(20)

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis)
    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)

    const doping = [true, false]
    const colors = d3.schemeCategory10
    const colorScale = d3.scaleOrdinal()
        .domain(doping)
        .range(colors)

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .classed("dot", true)
        .attr("data-xvalue", (d) => yearParse(d.Year))
        .attr("data-yvalue", (d) => hourParse(d.Time))
        .attr("cx", (d) => xScale(yearParse(d.Year)))
        .attr("cy", (d) => yScale(hourParse(d.Time)))
        .attr("r", 5)
        .attr("fill", (d) => colorScale(d.Doping.length === 0 ? true : false))
        .on("mouseover", (e) => { console.log("hihi") })

    const toolTip = svg.append("g")
        .attr("id", "tooltip")
        .attr("transform", "translate(120, 120)")
    toolTip.append("rect")
        .attr("width", "100")
        .attr("height", "100")
        .attr("fill", "red")
        .attr("x", "-10")
        .attr("y", "-10")
    toolTip.append("text")
        .text("hihi")
        .attr("text-anchor", "middle")
    // const toolTip = svg.append("text")
    //     .attr("x", "100")
    //     .attr("y", "100")
    // toolTip.append("tspan")
    //     .text("hihi")
    // toolTip.append("tspan")
    //     .text("gogo")
    //     .attr("dy", "-20")

    console.log(
        data,
        colorScale(false),
    )
}

fetchData()
