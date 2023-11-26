import "./main.scss"
import { date } from "./date"

async function fetchData() {
    const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    const data = (await response.json())
    const dataset = data.data

    const w = 900
    const h = 600
    const padding = 100

    const svg = d3.select("#container")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("background-color", "white")
        .style("box-shadow", "3px 3px 15px")

    svg.append("text")
        .attr("id", "title")
        .text("United States GDP")
        .attr("x", w / 2)
        .attr("text-anchor", "middle")
        .attr("y", padding - 10)
        .style("font-size", "30px")

    const xScale = d3.scaleTime()
        .domain([d3.min(dataset, (d) => date(d[0])), d3.max(dataset, (d) => date(d[0]))])
        .range([padding, w - padding])
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([h - padding, padding])

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

    const xAxisLabel = svg.append("text")
        .text("GDP in billions")
        .attr("y", "35")
        .attr("x", "-325")
        .style("transform", "rotate(270deg)")
    const yAxisLabel = svg.append("text")
        .text("Year")
        .attr("y", "545")
        .attr("x", "440")

    const toolTip = d3.select("#container")
        .insert("div", ":first-child")
        .attr("id", "tooltip")
        .classed("close", true)

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => `${d[1]}`)
        .attr("x", (d) => xScale(date(d[0])))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", (d) => (w - 2 * padding) / dataset.length)
        .attr("height", (d) => h - yScale(d[1]) - padding)
        .attr("fill", "#409cff")
        .attr("stroke", "black")
        .attr("stroke-width", "0.1")
        .attr("class", "bar")
        .on("mouseover", (e) => {
            toolTip.attr("data-date", e.target.dataset.date)
            toolTip.text(`${e.target.dataset.date}\n$${e.target.dataset.gdp} Billion`)
            toolTip.style("transform", `translate(${Number(d3.select(e.target).attr("x"))}px, ${Number(d3.select(e.target).attr("y")) - 65}px)`)
            toolTip.classed("close", false)
        })
        .on("mouseout", (e) => {
            toolTip.classed("close", true)
        })

    const source = svg.append("a")
        .attr("href", data.display_url)
        .append("text")
        .text(`${data.display_url}`)
        .attr("y", "580")
        .attr("x", "570")
        .attr("stroke", "skyblue")
        .attr("stroke-width", "0.25px")
}

fetchData()
