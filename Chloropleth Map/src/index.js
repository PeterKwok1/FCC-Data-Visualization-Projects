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
    let geoJSON = topojson.feature(topData, topData.objects.counties)


    const h = 700
    const w = 900
    const padding = 100

    const svg = d3.select("#container")
        .append("svg")
        .attr("height", h)
        .attr("width", w)
        .style("background-color", "white")
        .style("box-shadow", "3px 3px 15px")

    const projection = d3.geoIdentity()
        .fitExtent([[padding / 4, padding], [w - padding / 4, h]], geoJSON)

    const path = d3.geoPath()
        .projection(projection)

    svg.selectAll(null)
        .data(geoJSON.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("data-fips", (d) => `${d.id}`)
        .attr("data-education", (d) => {
            let data = ""
            eduData.forEach((e) => {
                if (d.id === e.fips) {
                    data = e.bachelorsOrHigher
                }
            })
            return data
        })
        .classed("county", true)
        .attr("fill", "#D9F0FF")
        .attr("stroke", "#A3D5FF")
        .attr("stroke-width", 1);

    let range = d3.extent(eduData, (d) => d.bachelorsOrHigher)
    let colorSpace = d3.schemeBlues[9]
    let section = (range[1] - range[0]) / 9
    let intervals = []
    colorSpace.forEach((e, i) => intervals.push(range[0] + section * i))
    intervals.shift()
    const colorScale = d3.scaleThreshold()
        .domain(intervals)
        .range(colorSpace)

    const title = svg.append("g")
        .style("text-anchor", "middle")
        .attr("transform", `translate(${w / 2}, 50)`)
    title.append("text")
        .attr("id", "title")
        .text("US Educational Attainment")
        .attr("font-size", "30")
    title.append("text")
        .attr("id", "description")
        .text("% of people aged >= 25 with at least a bachelor's degree")
        .attr("transform", `translate(0, 25)`)


    console.log(
        // topData,
        eduData,
        // geoJSON.features
    )

}

fetchData()

