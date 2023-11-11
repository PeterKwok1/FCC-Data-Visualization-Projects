import "./main.scss"
import * as date from "./date"

console.log(date.year("2000"))
console.log(date.month("3"))

async function fetchData() {
    const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    const data = await response.json()

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

    const xAxis = d3.scaleTime()


    console.log(
        data
    )
}

fetchData()