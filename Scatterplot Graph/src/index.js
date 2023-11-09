// compare to fcc example 
// update bar chart tool tip

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
        .domain(d3.extent(data, (d) => yearParse(d.Year)))
        .range([padding, w - padding])
        .nice()
    const yScale = d3.scaleTime()
        .domain(d3.extent(data, (d) => hourParse(d.Time)))
        .range([padding, h - padding])
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

    const labels = svg.append("g")
        .style("font-size", "large")
        .style("text-anchor", "middle")
    labels.append("text")
        .style("transform", "rotate(270deg)")
        .text("Minutes")
        .attr("x", "-300")
        .attr("y", "40")
    labels.append("text")
        .text("Year")
        .attr("x", "450")
        .attr("y", "550")

    const doping = [true, false]
    const colors = d3.schemeCategory10
    const colorScale = d3.scaleOrdinal()
        .domain(doping)
        .range(colors)

    const tooltip = d3.select("#container")
        .insert("div", ":first-child")
        .attr("id", "tooltip")
        .classed("close", true)

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .classed("dot", true)
        .attr("data-xvalue", (d) => yearParse(d.Year)) // for tests
        .attr("data-yvalue", (d) => hourParse(d.Time)) // for tests
        .attr("data-name", (d) => d.Name)
        .attr("data-nationality", (d) => d.Nationality)
        .attr("data-year", (d) => d.Year)
        .attr("data-time", (d) => d.Time)
        .attr("data-allegations", (d) => d.Doping)
        .attr("cx", (d) => xScale(yearParse(d.Year)))
        .attr("cy", (d) => yScale(hourParse(d.Time)))
        .attr("r", 5)
        .attr("fill", (d) => colorScale(d.Doping.length === 0 ? true : false))
        .on("mouseover", (e) => {
            tooltip.attr("data-year", e.target.dataset.xvalue) // for tests
                .text(`${e.target.dataset.name}, ${e.target.dataset.nationality}\n${e.target.dataset.year}, ${e.target.dataset.time}\n${e.target.dataset.allegations}`)
                .style("transform", `translate(${Number(d3.select(e.target).attr("cx")) + 20}px, ${Number(d3.select(e.target).attr("cy")) - 15}px)`)
                .classed("close", false)
        })
        .on("mouseout", (e) => {
            tooltip.classed("close", true)
        })

    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", "translate(600, 175)")
    legend.append("rect")
        .attr("height", "80px")
        .attr("width", "155px")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("rx", "2px")
        .attr("y", "-20px")
    legend.append("text")
        .style("font-size", "large")
        .text("Doping Allegations")
        .attr("x", "6px")
    legend.selectAll(null)
        .data(doping)
        .enter()
        .append("text")
        .attr("y", (d, i) => `${(i + 1) * 20 + 4}px`)
        .attr("x", "45px")
        .text((d) => d === true ? "No" : "Yes")
    legend.selectAll(null)
        .data(doping)
        .enter()
        .append("rect")
        .attr("x", "85")
        .attr("y", (d, i) => `${i * 20 + 10}px`)
        .attr("height", "17px")
        .attr("width", "17px")
        .attr("fill", (d) => `${colorScale(d)}`)
}

fetchData()
