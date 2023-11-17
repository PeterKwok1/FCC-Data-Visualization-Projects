// https://www.youtube.com/watch?v=FsDyelH58F0
// https://forum.freecodecamp.org/t/drawing-us-map-in-d3-chloropleth/481354/4
// https://medium.com/geekculture/advanced-map-visualization-and-cartography-with-d3-js-geojson-topojson-2de786ece0c3

import "./main.scss"

async function fetchData() {
    const eduResponse = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
    const eduData = await eduResponse.json()

    const topResponse = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
    const topData = await topResponse.json()

    const h = 600
    const w = 900
    const padding = 100

    const svg = d3.select("#container")
        .append("svg")
        .attr("height", `${h}`)
        .attr("width", `${w}`)
        .style("background-color", "white")



    console.log(
        // topData,
        topojson.feature(topData, topData.objects.counties)
    )
}

fetchData()

