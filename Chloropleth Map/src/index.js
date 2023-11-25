import "./main.scss"

async function fetchData() {
    const eduResponse = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
    const eduData = await eduResponse.json()

    const topResponse = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
    const topData = await topResponse.json()
    let geoJSON = topojson.feature(topData, topData.objects.counties)

    for (let i = 0; i < geoJSON.features.length; i++) {
        for (let k = 0; k < eduData.length; k++) {
            if (geoJSON.features[i].id === eduData[k].fips) {
                geoJSON.features[i] = { ...geoJSON.features[i], ...eduData[k] }
            }
        }
    }

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

    let range = d3.extent(eduData, (d) => d.bachelorsOrHigher)
    let section = (range[1] - range[0]) / 9
    let intervals = []
    let colorSpace = d3.schemeBlues[9]
    for (let i = 0; i < colorSpace.length - 1; i++) {
        intervals.push(range[0] + section * (i + 1))
    }
    const colorScale = d3.scaleThreshold()
        .domain(intervals)
        .range(colorSpace)

    svg.selectAll(null)
        .data(geoJSON.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("data-fips", (d) => `${d.id}`)
        .attr("data-education", (d) => d.bachelorsOrHigher)
        .attr("data-state", (d) => d.state)
        .attr("data-county", (d) => d.area_name)
        .classed("county", true)
        .attr("fill", (d) => colorScale(d.bachelorsOrHigher))
        .attr("stroke", "#A3D5FF")
        .attr("stroke-width", 1)
        .on("mouseover", (e) => {
            tooltip.attr("data-education", `${d3.select(e.target).attr("data-education")}`)
                .text(`${d3.select(e.target).attr("data-state")},\n${d3.select(e.target).attr("data-county")}\n${d3.select(e.target).attr("data-education")}%`)
                .style("transform", `translate(${e.target.getPointAtLength(0).x + 25}px, ${e.target.getPointAtLength(0).y - 75}px)`)
                .classed("close", false)
        })
        .on("mouseout", (e) => {
            tooltip.classed("close", true)
        })

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

    const legendScale = d3.scaleLinear()
        .domain(range)
        .range([0, 200])
    const legendAxis = d3.axisBottom(legendScale)
        .tickFormat(d => d + "%")
    const legend = svg.append("g")
        .attr("transform", `translate(550, 150)`)
        .attr("id", "legend")
    legend.append("g")
        .call(legendAxis)
    legend.selectAll(null)
        .data(colorSpace)
        .enter()
        .append("rect")
        .attr("height", 200 / 9)
        .attr("width", 200 / 9)
        .attr("fill", (d) => d)
        .attr("x", (d, i) => i * 200 / 9)
        .attr("y", "-21")

    const tooltip = d3.select("#container")
        .insert("div", ":first-child")
        .attr("id", "tooltip")
        .classed("close", true)

    svg.selectAll(null)
        .data(topojson.feature(topData, topData.objects.states).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("fill-opacity", 0)
        .attr("pointer-events", "none")
}

fetchData()

