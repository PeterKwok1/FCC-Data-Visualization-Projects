// https://www.youtube.com/watch?v=60HBKI5VV_4 - 5:24
// https://treemap-diagram.freecodecamp.rocks/

// pass tests
// compare 

import "./main.scss"

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
for (let i = 0; i < datasets.length; i++) {
    if (datasets[i].name === "Kickstarter") {
        datasets[i].description = "Top 100 pledged by category"
    } else if (datasets[i].name === "Movies") {
        datasets[i].description = "Top 100 gross by genre"
    } else if (datasets[i].name === "Video Game Sales Data Top 100") {
        datasets[i].description = "Top 100 sold by platform"
    }
}
console.log(datasets)



const h = 750, w = 1150, paddingT = 100, paddingB = 50, paddingL = 50, paddingR = 200
const svg = d3.select("#data").attr("height", h).attr("width", w).style("background-color", "white").style("box-shadow", "3px 3px 15px")



function appendData(data) {
    const title = svg.append("text").attr("id", "title").attr("font-size", "30").attr("text-anchor", "middle").attr("transform", `translate(${w / 2}, ${paddingT / 2})`).text(`${data.name}`)
    const description = svg.append("text").attr("id", "description").attr("text-anchor", "middle").attr("transform", `translate(${w / 2}, ${paddingT / (4 / 3)})`).text(`${data.description}`)

    const hierarchy = d3.hierarchy(data).sum(d => d.value)
    const treemap = d3.treemap().size([w - (paddingL + paddingR), h - (paddingT + paddingB)]).paddingInner(1)(hierarchy)
    const parents = treemap.descendants().filter(e => e.depth === 1)
    const leaves = treemap.descendants().filter(e => e.depth === 2)
    function fader(color) { return d3.interpolateRgb(color, "#ffffff")(0.25) }
    const colorScale = d3.scaleOrdinal()
        .range(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3", "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"].map(e => fader(e)))

    const cells = svg.selectAll(".tile")
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
        .attr("transform", d => `translate(${d.x0 + paddingL}, ${d.y0 + paddingT})`)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => colorScale(d.parent.data.name))

    const cellSizeRange = d3.extent(leaves, (d) => (d.x1 - d.x0) * (d.y1 - d.y0))
    const fontSizeRange = [12, 24]
    const paddingRange = [2, 10]
    const cellFontScale = d3.scaleLinear()
        .domain(cellSizeRange)
        .range(fontSizeRange)
    const paddingScale = d3.scaleLinear()
        .domain(cellSizeRange)
        .range(paddingRange)

    const titles = d3.select("#descriptions")
        .selectAll(".description")
        .data(leaves)
        .join(
            (enter) => enter.append("div"),
            (update) => update,
            (exit) => exit.remove()
        )
        .classed("description", true)
        .text(d => d.data.name)
        .style("height", d => {
            if (d.x1 - d.x0 >= d.y1 - d.y0) {
                return `${d.y1 - d.y0}px`
            } else {
                return `${d.x1 - d.x0}px`
            }
        })
        .style("width", d => {
            if (d.x1 - d.x0 >= d.y1 - d.y0) {
                return `${d.x1 - d.x0}px`
            } else {
                return `${d.y1 - d.y0}px`
            }
        })
        .style("transform", d => {
            if (d.x1 - d.x0 >= d.y1 - d.y0) {
                return `translate(${d.x0 + paddingL}px, ${d.y0 + paddingT}px)`
            } else {
                return `translate(${d.x0 - Math.abs(((d.y1 - d.y0) / 2) - ((d.x1 - d.x0) / 2)) + paddingL}px, ${d.y0 + Math.abs(((d.x1 - d.x0) / 2) - ((d.y1 - d.y0) / 2)) + paddingT}px) rotate(90deg)`
                // realigns since changing dimensions translates. 
            }
        })
        .style("font-size", (d) => {
            return `${cellFontScale((d.x1 - d.x0) * (d.y1 - d.y0))}px`
        })
        .style("padding", (d) => {
            return `${paddingScale((d.x1 - d.x0) * (d.y1 - d.y0))}px`
        })
        .on("mouseover", e => {
            // tooltip.text(`${}\n${}\n${}`)
        })

    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${w - (paddingR - 30)}, ${paddingT})`)

    legend.selectAll(".legend-item")
        .data(parents)
        .join(
            enter => enter.append("rect"),
            update => update,
            exit => exit.remove()
        )
        .classed("legend-item", true)
        .attr("height", 20)
        .attr("width", 20)
        .attr("transform", (d, i) => `translate(0, ${i * 30})`)
        .attr("fill", d => colorScale(d.data.name))

    legend.selectAll(".legendLabels")
        .data(parents)
        .join(
            enter => enter.append("text"),
            update => update,
            exit => exit.remove()
        )
        .classed("legendLabels", true)
        .attr("transform", (d, i) => `translate(30, ${i * 30 + 20})`)
        .text(d => d.data.name)

    const tooltip = d3.select("#tooltip")
        .classed("close", true)

    const dataSelect = d3.select("#data-select")
        .style("transform", `translate(${w - (paddingR - 30)}px, ${paddingT - 50}px)`)
        .text("input ph")

    console.log(parents)
}

appendData(datasets[0])

