import "./main.scss"

async function test() {
    const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    const data = (await response.json()).data

    const w = 720
    const h = 480
    const padding = 50

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d[1])])
        .range([padding, w - padding])
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d[0])])
        .range([h - padding, padding])

    d3.select("#container")
        .append("svg")
        .attr("width", w)
        .attr("height", h)


    console.log(data[0][1])

}

test()