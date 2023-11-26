import "./main.scss"

const h = 600
const w = 900
const padding = 100

const svg = d3.select("#container")
    .append("svg")
    .attr("height", h)
    .attr("width", w)
    .style("background-color", "white")
    .style("box-shadow", "3px 3px 15px")

let sources = [
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
]

async function fetchData(links) {
    let responses = await Promise.all(links.map(e => fetch(e)))
    let data = await Promise.all(responses.map(e => e.json()))
    console.log(data)
}

fetchData(sources)
