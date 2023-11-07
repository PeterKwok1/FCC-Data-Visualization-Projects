// complete tests
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
        .attr("data-xvalue", (d) => yearParse(d.Year)) // for tests
        .attr("data-yvalue", (d) => hourParse(d.Time)) // for tests
        .attr("data-name", (d) => d.Name)
        .attr("data-nationality", (d) => d.Nationality)
        .attr("data-Year", (d) => d.Year)
        .attr("data-Time", (d) => d.Time)
        .attr("data-allegations", (d) => d.Doping)
        .attr("cx", (d) => xScale(yearParse(d.Year)))
        .attr("cy", (d) => yScale(hourParse(d.Time)))
        .attr("r", 5)
        .attr("fill", (d) => colorScale(d.Doping.length === 0 ? true : false))
        .on("mouseover", (e) => {
            nameNationality.text(`${e.target.dataset.name}, ${e.target.dataset.nationality}`)
            yearTime.text(`${e.target.dataset.Year}, ${e.target.dataset.Time}`)
            allegations.text(e.target.dataset.allegations)
            toolTip.attr("data-year", e.target.dataset.xvalue) // for tests
                .attr("transform", `translate(
                    ${d3.select(e.target).attr("cx")}, 
                    ${d3.select(e.target).attr("cy")}
                    )`)
                .classed("close", false)
        })
        .on("mouseout", (e) => {
            // toolTip.classed("close", true)
        })

    const toolTip = svg.append("g")
        .attr("id", "tooltip")
        .classed("close", true)
    toolTip.append("rect")
        .attr("width", "100")
        .attr("height", "66")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("rx", "5")
        .attr("transform", "translate(-5, -15)")
    const nameNationality = toolTip.append("text")
    const yearTime = toolTip.append("text")
        .attr("y", "15")
    const allegations = toolTip.append("text")
        .attr("y", "30")

    console.log(
        data,
        colorScale(false),
    )
}

fetchData()
