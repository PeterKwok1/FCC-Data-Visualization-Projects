// https://www.youtube.com/watch?v=60HBKI5VV_4 - 5:24
// https://treemap-diagram.freecodecamp.rocks/

// generate 20 colors.

import "./main.scss"

const h = 600, w = 900, padding = 100, legend = 100
const svg = d3.select("#container").append("svg").attr("height", h + legend).attr("width", w).style("background-color", "white").style("box-shadow", "3px 3px 15px")

const title = svg.append("text").attr("id", "title").attr("font-size", "30").attr("text-anchor", "middle").attr("transform", `translate(${w / 2}, ${padding / 2})`)
const description = svg.append("text").attr("id", "description").attr("text-anchor", "middle").attr("transform", `translate(${w / 2}, 75)`)

let sources = [
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
]
async function fetchData(links) {
    let responses = await Promise.all(links.map(e => fetch(e)))
    let data = await Promise.all(responses.map(e => e.json()))
    return data
}
const datasets = await fetchData(sources)
console.log(datasets)

function appendData(data) {
    const hierarchy = d3.hierarchy(data).sum(d => d.value)
    const treemap = d3.treemap().size([w, h]).padding(1)(hierarchy)
    const leaves = treemap.descendants().filter(e => e.depth === 2)
    function fader(color) { return d3.interpolateRgb(color, "#ffffff")(0.25) }
    const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10.map(e => fader(e)))

    const cells = svg.selectAll("rect")
        .data(leaves)
        .enter()
        .append("rect")
        .attr("transform", d => `translate(${d.x0}, ${d.y0})`)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => colorScale(d.parent.data.name))

    console.log(leaves)
}

appendData(datasets[0])
