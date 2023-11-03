import "./main.scss"

async function fetchData() {
    const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    const data = await response.json()
    console.log(data)
    console.log(data[0].Time)
    console.log(d3.max(data, (d) => d.Time))
    console.log(d3.min(data, (d) => d.Time))

    const w = 900
    const h = 600
    const padding = 100

    const xScale = d3.scaleLinear()
        .domain([])
    const yScale = d3.scaleTime()
        .domain([d3.min(data, (d) => d.Time), d3.max(data, (d) => d.Time)])
        .range([0, 100])

    console.log(yScale("39:50"))

    const svg = d3.select("#container")
        .append("svg")
        .attr("width", "900")
        .attr("height", "600")


}

fetchData()