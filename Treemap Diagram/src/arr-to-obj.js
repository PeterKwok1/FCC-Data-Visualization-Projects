export function arrToObj(arr) {
    const obj = {}
    arr.forEach(e => {
        obj[e.name] = e
        if (e.name === "Kickstarter") {
            obj[e.name].description = "Top 100 pledged by category"
        } else if (e.name === "Movies") {
            obj[e.name].description = "Top 100 gross by genre"
        } else if (e.name === "Video Game Sales Data Top 100") {
            obj[e.name].description = "Top 100 sold by platform"
        }
    })
    return obj
}