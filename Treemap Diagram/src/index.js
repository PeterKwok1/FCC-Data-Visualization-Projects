// https://www.youtube.com/watch?v=60HBKI5VV_4

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

}
