import "./main.scss"
import { fetchData } from "./fetch"
import { arrToObj } from "./arr-to-obj"

const data = [
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
]
const datasetsArr = await fetchData(data)
const datasetsObj = arrToObj(datasetsArr)

const h = 950, w = 1450, paddingT = 100, paddingB = 50, paddingL = 50, paddingR = 200
const svg = d3.select("#data").attr("height", h).attr("width", w)
const title = svg.append("text").attr("id", "title").attr("transform", `translate(${w / 2}, ${paddingT / 2})`)
const description = svg.append("text").attr("id", "description").attr("transform", `translate(${w / 2}, ${paddingT / (4 / 3)})`)
const legend = svg.append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${w - (paddingR - 30)}, ${paddingT})`)
const tooltip = d3.select("#tooltip")
    .classed("close", true)
const dataSelect = d3.select("#data-select")
    .style("transform", `translate(${w - (paddingR - 30)}px, ${paddingT - 50}px)`)
    .on("change", (e) => {
        appendData(datasetsObj[e.target.value])
    })
    .selectAll("option")
    .data(Object.keys(datasetsObj))
    .join(
        enter => enter.append("option"),
        update => update,
        exit => exit.remove()
    )
    .text(d => d)

appendData(datasetsObj.Kickstarter)

function appendData(data) {
    title.text(`${data.name}`)
    description.text(`${data.description}`)

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
            enter => enter.append("rect"),
            update => update,
            exit => exit.remove()
        )
        .classed("tile", true)
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => (d.y1 - d.y0) * (d.x1 - d.x0))
        .attr("transform", d => `translate(${d.x0 + paddingL}, ${d.y0 + paddingT})`)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => colorScale(d.parent.data.name))
        .on("mousemove", (e, d) => {
            tooltip
                .attr("data-value", `${(d.y1 - d.y0) * (d.x1 - d.x0)}`)
                .text(`${d.data.category}\n${d.data.name}\n${d.data.value}`)
                .style("transform", `translate(${e.offsetX + 20}px, ${e.offsetY - 80}px)`)
                .classed("close", false)
        })
        .on("mouseout", () => {
            tooltip
                .classed("close", true)
        })

    const cellSizeRange = d3.extent(leaves, (d) => (d.x1 - d.x0) * (d.y1 - d.y0))
    const fontSizeRange = [10, 36]
    const paddingRange = [0, 8]
    const cellFontScale = d3.scaleLinear()
        .domain(cellSizeRange)
        .range(fontSizeRange)
    const paddingScale = d3.scaleLinear()
        .domain(cellSizeRange)
        .range(paddingRange)

    const contents = d3.select("#contents")
        .selectAll(".content")
        .data(leaves)
        .join(
            (enter) => enter.append("div"),
            (update) => update,
            (exit) => exit.remove()
        )
        .classed("content", true)
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
}



