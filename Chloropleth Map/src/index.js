// https://www.youtube.com/watch?v=FsDyelH58F0
// https://forum.freecodecamp.org/t/drawing-us-map-in-d3-chloropleth/481354/4
// https://medium.com/geekculture/advanced-map-visualization-and-cartography-with-d3-js-geojson-topojson-2de786ece0c3
// https://choropleth-map.freecodecamp.rocks/
// https://github.com/topojson/topojson 

// separate asyn from non async

import "./main.scss"

async function fetchData() {
    const eduResponse = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
    const eduData = await eduResponse.json()

    const topResponse = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
    const topData = await topResponse.json()

    const h = 700
    const w = 900
    const padding = 100

    const svg = d3.select("#container")
        .append("svg")
        .attr("height", h)
        .attr("width", w)
        .style("background-color", "white")

    const projection = d3.geoIdentity()
        .fitExtent([[padding / 4, padding], [w - padding / 4, h]], topojson.feature(topData, topData.objects.states))

    const path = d3.geoPath()
        .projection(projection)

    svg.selectAll(null)
        .data(topojson.feature(topData, topData.objects.states).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#D9F0FF")
        .attr("stroke", "#A3D5FF")
        .attr("stroke-width", 1);

    console.log(
        // topData,
        topojson.feature(topData, topData.objects.states).features
    )
}

fetchData()

