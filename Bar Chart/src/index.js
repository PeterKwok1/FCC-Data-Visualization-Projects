import "./main.scss"

async function test() {
    const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    const data = (await response.json()).data

    const w = 720
    const h = 480
    const padding = 50

    const xScale = d3.scaleLinear()
        .domain([d3.min((data), d => Number(d[0].match(/^\d{4}/)[0])), d3.max])
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
        .attr("x", (d, i) => w / data.length * i)
        .attr("y", (d, i) => h - d[1])
        .attr("width", 8)
        .attr("height", (d, i) => d[1])
        .attr("fill", "#87CEEB")
        .attr("class", "bar") //hover 
        .append("title")
        .text(d => d[0]) // tooltip

    const xAxis = d3.axisBottom(xScale)

    svg.append("g")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis)

    console.log(data)

}

test()