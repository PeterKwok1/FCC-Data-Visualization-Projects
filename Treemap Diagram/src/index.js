// https://www.youtube.com/watch?v=60HBKI5VV_4 - 5:24
// https://treemap-diagram.freecodecamp.rocks/

// description wrap
// see if can group descriptions.
// pass tests
// compare - links

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
    const colorScale = d3.scaleOrdinal().range(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3", "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"].map(e => fader(e)))

    const cells = svg.selectAll("rect")
        .data(leaves)
        .join(
            (enter) => enter.append("rect"),
            (update) => update,
            (exit) => exit.remove()
        )
        .classed("tile", true)
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => (d.y1 - d.y0) * (d.x1 - d.x0))
        .attr("transform", d => `translate(${d.x0}, ${d.y0})`)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => colorScale(d.parent.data.name))

    const text = d3.select("#container")
        .insert("div", ":first-child")
        .selectAll(".description")
        .data(leaves)
        .join(
            (enter) => enter.append("div"),
            (update) => update,
            (exit) => exit.remove()
        )
        .classed("description", true)
        .text(d => d.data.name)
        .style("transform", d => {
            if (d.x1 - d.x0 >= d.y1 - d.y0) {
                return `translate(${d.x0}px, ${d.y0}px)`
            } else {
                // return `translate(${d.x0}px, ${d.y0}px)`
                return `translate(${d.x0 - (((d.y1 - d.y0) / 2) - ((d.x1 - d.x0) / 2))}px, ${d.y0 - (((d.x1 - d.x0) / 2) - ((d.y1 - d.y0) / 2))}px) rotate(90deg)`
                // adjust by the difference between centers (imagine rotating to fit match).
                // o - (((d.y1-d.y0)/2) - ((d.x1 - d.x0)/2))
                // o + (((d.x1-d.x0)/2) - ((d.y1 - d.y0)/2))
            }
        })
        .style("height", d => {
            if (d.x1 - d.x0 >= d.y1 - d.y0) {
                return `${d.y1 - d.y0}px`
            } else {
                // return `${d.y1 - d.y0}px`
                return `${d.x1 - d.x0}px`
            }
        })
        .style("width", d => {
            if (d.x1 - d.x0 >= d.y1 - d.y0) {
                return `${d.x1 - d.x0}px`
            } else {
                // return `${d.x1 - d.x0}px`
                return `${d.y1 - d.y0}px`
            }
        })
    // .classed("vertical", (d) => {
    //     if (d.x1 - d.x0 >= d.y1 - d.y0) {
    //         return false
    //     } else {
    //         return true
    //     }
    // })

    console.log(text)
}

appendData(datasets[0])

