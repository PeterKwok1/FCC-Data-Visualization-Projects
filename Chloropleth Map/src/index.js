// https://www.youtube.com/watch?v=FsDyelH58F0

import "./main.scss"

async function fetchData() {
    const eduResponse = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
    const eduData = await eduResponse.json()

    const topResponse = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
    const topData = await topResponse.json()


    console.log(
        topData
    )
}

fetchData()

